require_relative 'server'

def assert(condition, message)
  raise message unless condition
  puts "PASS: #{message}"
end

def rejects(message)
  begin
    yield
  rescue LinkChecker::CheckError
    puts "PASS: #{message}"
    return
  end
  raise "Expected rejection: #{message}"
end

html = <<~HTML
  <!-- <a href="https://ignored.example"> -->
  <script>const a = '<a href="https://ignored.example">';</script>
  <base href="https://example.com/docs/">
  <a href="../ok?x=1&amp;y=2">One</a><a href='../ok?x=1&amp;y=2#part'>Duplicate</a>
  <a data-href="https://ignored.example" href=guide>Guide</a>
  <area href="/map"><a href="#section">Fragment</a><a href="mailto:a@example.com">Email</a>
  <a href="javascript:void(0)">Script</a><a href="">Empty</a>
HTML
found = LinkChecker.extract(html, 'https://example.com/start')
assert(found[:links] == ['https://example.com/ok?x=1&y=2', 'https://example.com/docs/guide', 'https://example.com/map'], 'HTML extraction handles base, entities, relative URLs, deduplication and inert tags')
assert(found[:skipped] == 4, 'Non-web and fragment links are skipped')
rejects('Credentials rejected') { LinkChecker.normalize('https://user:secret@example.com/') }
rejects('File scheme rejected') { LinkChecker.normalize('file:///etc/passwd') }
rejects('Custom ports rejected') { LinkChecker.normalize('http://example.com:22') }
rejects('Loopback rejected') { LinkChecker.public_address('127.0.0.1') }
rejects('Private networks rejected') { LinkChecker.public_address('10.0.0.1') }
rejects('IPv6 loopback rejected') { LinkChecker.public_address('::1') }

class << LinkChecker
  alias_method :real_fetch, :fetch
  attr_accessor :fixture_code, :fixture_redirects, :calls
  def fetch(url, method: :get, read_body: false)
    self.calls << method
    { code: fixture_code, redirects: fixture_redirects, url: url.to_s, body: '' }
  end
end
[ [200, 0, 'healthy'], [200, 1, 'redirected'], [404, 0, 'broken'], [500, 0, 'broken'], [403, 0, 'unverified'], [429, 0, 'unverified'] ].each do |code, redirects, status|
  LinkChecker.fixture_code = code
  LinkChecker.fixture_redirects = redirects
  LinkChecker.calls = []
  assert(LinkChecker.check('https://example.com')[:status] == status, "HTTP #{code}, redirects #{redirects}: #{status}")
  assert(LinkChecker.calls == [:head, :get], 'HEAD access denial retries GET') if code == 403
end
class << LinkChecker
  alias_method :fetch, :real_fetch
end
puts 'All checks passed.'
