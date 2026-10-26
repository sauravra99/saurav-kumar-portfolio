require 'webrick'
require 'net/http'
require 'uri'
require 'json'
require 'ipaddr'
require 'resolv'
require 'timeout'
require 'cgi'
require 'strscan'

module LinkChecker
  LIMIT = 100
  MAX_BODY = 2 * 1024 * 1024
  BLOCKED = %w[0.0.0.0/8 10.0.0.0/8 100.64.0.0/10 127.0.0.0/8 169.254.0.0/16 172.16.0.0/12 192.0.0.0/24 192.0.2.0/24 192.168.0.0/16 198.18.0.0/15 198.51.100.0/24 203.0.113.0/24 224.0.0.0/4 240.0.0.0/4].map { |s| IPAddr.new(s) }
  class CheckError < StandardError; end
  def self.normalize(value, base = nil)
    url = base ? URI.join(base.to_s, value.strip) : URI.parse(value.strip)
    raise CheckError, 'Enter a public http:// or https:// URL.' unless %w[http https].include?(url.scheme) && url.host
    raise CheckError, 'URLs with credentials or nonstandard ports are not supported.' if url.userinfo || ![80, 443].include?(url.port)
    url.fragment = nil
    url.path = '/' if url.path.empty?
    url
  rescue URI::InvalidURIError
    raise CheckError, 'This URL is not valid. Include https:// and a valid hostname.'
  end
  def self.public_address(host)
    addresses = Timeout.timeout(4) { Resolv.getaddresses(host) }
    raise CheckError, 'Hostname could not be resolved.' if addresses.empty?
    addresses.each do |address|
      ip = IPAddr.new(address)
      # Restrict IPv6 to global unicast and exclude embedded IPv4 transition ranges.
      public_ip = ip.ipv4? ? BLOCKED.none? { |range| range.include?(ip) } : IPAddr.new('2000::/3').include?(ip) && !IPAddr.new('2001::/23').include?(ip) && !IPAddr.new('2002::/16').include?(ip) && !IPAddr.new('2001:db8::/32').include?(ip)
      raise CheckError, 'Private, local, and reserved network addresses are not checked.' unless public_ip
    end
    addresses.first
  end
  def self.fetch(input, method: :get, read_body: false)
    url = normalize(input.to_s)
    visited = []
    6.times do
      raise CheckError, 'Redirect loop detected.' if visited.include?(url.to_s)
      visited << url.to_s
      address = public_address(url.hostname)
      # Pin the validated address; retain hostname for Host, TLS SNI and verification.
      http = Net::HTTP.new(url.hostname, url.port, nil)
      if http.respond_to?(:ipaddr=)
        http.ipaddr = address
      else
        # Ruby 2.6 connects via #address but verifies TLS against @address.
        http.define_singleton_method(:address) { address }
      end
      http.use_ssl = url.scheme == 'https'
      http.open_timeout = 5
      http.read_timeout = 5
      http.max_retries = 0
      request = (method == :head ? Net::HTTP::Head : Net::HTTP::Get).new(url.request_uri)
      request['Host'] = url.host + (url.port == url.default_port ? '' : ":#{url.port}")
      request['User-Agent'] = 'LinkLens/1.0 (public-page link checker)'
      request['Accept-Encoding'] = 'identity'
      body = ''.b
      response = nil
      catch(:headers_only) do
      http.start do |connection|
        connection.request(request) do |res|
          response = res
          throw :headers_only unless read_body && res.code.to_i.between?(200, 299)
          if read_body && res.code.to_i.between?(200, 299)
            raise CheckError, 'The submitted URL must return an HTML page.' unless res['content-type'].to_s.match?(/text\/html|application\/xhtml\+xml/i)
            res.read_body do |chunk|
              body << chunk
              raise CheckError, 'Page exceeds the 2 MB scan limit.' if body.bytesize > MAX_BODY
            end
          end
        end
      end
      end
      if [301, 302, 303, 307, 308].include?(response.code.to_i)
        raise CheckError, 'Redirect has no destination.' unless response['location']
        url = normalize(response['location'], url)
        next
      end
      return { code: response.code.to_i, url: url.to_s, redirects: visited.length - 1, body: body.force_encoding('UTF-8').scrub }
    end
    raise CheckError, 'Too many redirects (maximum 5).'
  end
  def self.extract(html, page_url)
    # Tokenize tags while respecting quoted attributes; ignore inert raw-text content.
    html = html.gsub(/<!--.*?-->/m, '').gsub(/<(script|style|textarea|title)\b[^>]*>.*?<\/\1\s*>/mi, '')
    tags = html.scan(/<(?:"[^"]*"|'[^']*'|[^'">])*>/m)
    base = page_url
    anchors = []
    base_seen = false
    tags.each do |tag|
      name = tag[/\A<\s*([a-z][\w:-]*)/i, 1].to_s.downcase
      next unless %w[a area base].include?(name)
      scanner = StringScanner.new(tag.sub(/\A<\s*[\w:-]+/, ''))
      attrs = {}
      until scanner.eos?
        scanner.skip(/\s+/)
        break if scanner.check(/\/?\s*>/)
        key = scanner.scan(/[^\s=\/>]+/)
        unless key
          scanner.getch
          next
        end
        scanner.skip(/\s*/)
        value = ''
        if scanner.scan(/=/)
          scanner.skip(/\s*/)
          value = if scanner.scan(/"/)
            scanner.scan(/[^"]*/).to_s.tap { scanner.scan(/"/) }
          elsif scanner.scan(/'/)
            scanner.scan(/[^']*/).to_s.tap { scanner.scan(/'/) }
          else
            scanner.scan(/[^\s>]+/).to_s
          end
        end
        attrs[key.downcase] ||= CGI.unescapeHTML(value)
      end
      next unless attrs.key?('href')
      if name == 'base' && !base_seen
        base_seen = true
        begin
          base = normalize(attrs['href'], page_url).to_s
        rescue CheckError
          # Ignore unusable base URLs.
        end
      elsif name != 'base'
        anchors << attrs['href']
      end
    end
    skipped = 0
    links = anchors.map do |href|
      if href.strip.empty? || href.strip.start_with?('#') || href.match?(/\A\s*(mailto|tel|javascript|data):/i)
        skipped += 1
        next
      end
      begin
        normalize(href, base).to_s
      rescue CheckError
        skipped += 1
        nil
      end
    end
    { links: links.compact.uniq, skipped: skipped }
  end
  def self.check(url)
    Timeout.timeout(12) do
      result = fetch(url, method: :head)
      result = fetch(url) if [403, 405, 501].include?(result[:code])
      code = result[:code]
      status = if code.between?(200, 299)
        result[:redirects] > 0 ? 'redirected' : 'healthy'
      elsif [401, 403, 407, 429].include?(code)
        'unverified'
      elsif code >= 400
        'broken'
      else
        'unverified'
      end
      { url: url, final_url: result[:url], code: code, status: status, detail: status == 'unverified' ? 'Access restricted, rate limited, or inconclusive response.' : (result[:redirects] > 0 ? "Followed #{result[:redirects]} redirect(s)." : "HTTP #{code}") }
    end
  rescue StandardError => error
    { url: url, final_url: nil, code: nil, status: 'unverified', detail: error.is_a?(CheckError) ? error.message : 'Could not verify: timeout, DNS, TLS, or connection error.' }
  end
  def self.scan(input)
    page = Timeout.timeout(15) { fetch(normalize(input).to_s, read_body: true) }
    raise CheckError, "The page returned HTTP #{page[:code]}. Try a publicly accessible HTML page." unless page[:code].between?(200, 299)
    extracted = extract(page[:body], page[:url])
    links = extracted[:links].first(LIMIT)
    queue = Queue.new
    links.each_with_index { |link, i| queue << [link, i] }
    results = Array.new(links.length)
    deadline = Process.clock_gettime(Process::CLOCK_MONOTONIC) + 45
    workers = Array.new([6, links.length].min) do
      Thread.new do
        loop do
          begin
            link, i = queue.pop(true)
          rescue ThreadError
            break
          end
          results[i] = if Process.clock_gettime(Process::CLOCK_MONOTONIC) > deadline
            { url: link, code: nil, status: 'unverified', detail: 'Scan time limit reached. Try again later.' }
          else
            check(link)
          end
        end
      end
    end
    workers.each(&:join)
    { page_url: page[:url], found: extracted[:links].length, checked: results.length, skipped: extracted[:skipped], limited: extracted[:links].length > LIMIT, results: results }
  end
end

if $PROGRAM_NAME == __FILE__
  port = Integer(ENV.fetch('PORT', '8081'))
  bind_address = ENV.fetch('BIND_ADDRESS', '127.0.0.1')
  allowed_hosts = ["127.0.0.1:#{port}", "localhost:#{port}"]
  allowed_origins = ["http://127.0.0.1:#{port}", "http://localhost:#{port}"]
  if ENV['PUBLIC_ORIGIN'] && !ENV['PUBLIC_ORIGIN'].empty?
    public_uri = URI.parse(ENV['PUBLIC_ORIGIN'])
    unless public_uri.scheme == 'https' && public_uri.host && !public_uri.userinfo && !public_uri.query && !public_uri.fragment && ['', '/'].include?(public_uri.path)
      abort 'PUBLIC_ORIGIN must be an HTTPS origin without a path, credentials, query, or fragment.'
    end
    authority = public_uri.host + (public_uri.port == 443 ? '' : ":#{public_uri.port}")
    allowed_hosts << authority
    # HTTPS proxies may preserve the explicit default port in the Host header.
    allowed_hosts << "#{public_uri.host}:443" if public_uri.port == 443
    allowed_origins << "https://#{authority}"
  end
  portfolio_root = File.expand_path('..', __dir__)
  server = WEBrick::HTTPServer.new(Port: port, BindAddress: bind_address, AccessLog: [], Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN))
  server.mount_proc('/health') do |_req, res|
    res['Content-Type'] = 'application/json'
    res.body = '{"status":"ok"}'
  end
  # Expose only the portfolio's public assets, never source, tests or dotfiles.
  server.mount_proc('/') do |req, res|
    if ['/', '/index.html'].include?(req.path)
      res['Content-Type'] = 'text/html; charset=utf-8'
      res.body = File.read(File.join(portfolio_root, 'index.html'))
    else
      res.status = 404
      res.body = 'Not found'
    end
  end
  %w[css js assets].each do |directory|
    server.mount("/#{directory}", WEBrick::HTTPServlet::FileHandler, File.join(portfolio_root, directory), FancyIndexing: false)
  end
  server.mount('/link-checker/public', WEBrick::HTTPServlet::FileHandler, File.join(__dir__, 'public'), FancyIndexing: false)
  busy = Mutex.new
  server.mount_proc('/api/scan') do |req, res|
    res['Content-Type'] = 'application/json'
    res['Cache-Control'] = 'no-store'
    locked = false
    begin
      raise LinkChecker::CheckError, 'Use a JSON POST request.' unless req.request_method == 'POST' && req['content-type'].to_s.start_with?('application/json')
      raise LinkChecker::CheckError, 'Invalid request host.' unless allowed_hosts.include?(req['host'])
      raise LinkChecker::CheckError, 'Invalid request origin.' if req['origin'] && !allowed_origins.include?(req['origin'])
      raise LinkChecker::CheckError, 'Request is too large.' if req.body.to_s.bytesize > 4096
      payload = JSON.parse(req.body.to_s)
      raise LinkChecker::CheckError, 'Provide a page URL.' unless payload.is_a?(Hash) && payload['url'].is_a?(String)
      locked = busy.try_lock
      unless locked
        res.status = 429
        raise LinkChecker::CheckError, 'A scan is already running. Please try again shortly.'
      end
      res.body = JSON.generate(LinkChecker.scan(payload['url']))
    rescue LinkChecker::CheckError, JSON::ParserError => error
      res.status = 400 if res.status == 200
      res.body = JSON.generate(error: error.message)
    rescue StandardError
      res.status = 502
      res.body = JSON.generate(error: 'Could not load this page. Check the URL; the website may block automated requests or be unavailable.')
    ensure
      busy.unlock if locked
    end
  end
  trap('INT') { server.shutdown }
  trap('TERM') { server.shutdown }
  puts "Portfolio: http://127.0.0.1:#{port}/"
  puts "LinkLens: http://127.0.0.1:#{port}/link-checker/public/"
  server.start
end
