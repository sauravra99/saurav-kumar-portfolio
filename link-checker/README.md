# LinkLens — broken-link checker

A standalone local app. Enter a public page URL to check up to 100 unique HTTP(S) links found in its HTML, including external destinations.

## Run

Requires Ruby with WEBrick (available in this Mac’s Ruby 2.6 installation). On newer Ruby versions, install WEBrick with `gem install webrick` if necessary.

From the portfolio folder:

```sh
ruby link-checker/server.rb
```

Open **http://127.0.0.1:8081/link-checker/public/**, or open the portfolio at **http://127.0.0.1:8081/** and select **Try LinkLens**. Alternatively, run the **Run LinkLens** VS Code task. Stop with Ctrl+C. Set `PORT` to use another port.

The UI must be opened through this server, not as a file or through a static server. The same server serves the portfolio and the checker.

## Results

- **Healthy:** destination returns HTTP 2xx.
- **Redirected:** a redirect chain ends in HTTP 2xx.
- **Broken:** destination returns HTTP 4xx/5xx, except access restrictions and rate limits.
- **Unverified:** authentication, bot blocking, rate limiting, network/TLS errors, timeouts, unsafe destinations, or inconclusive responses. These are not confirmed broken.

Use filters or URL search, then download the full report as CSV. HEAD requests fall back to GET for 403, 405, and 501 responses. Redirects are followed up to five hops. Duplicate URLs are checked once; fragments are removed.

## Scope and limits

This checks one HTML page, not an entire domain. It does not execute JavaScript, sign into websites, validate fragment targets, or inspect image/script/CSS resources. Non-web URLs are skipped. The page limit is 2 MB, with six concurrent destination checks, a 12-second deadline per destination and an approximately one-minute checking budget. Remaining links are marked unverified when the budget expires.

The local server binds to loopback. Outbound requests only allow public addresses on ports 80/443; every redirect is revalidated. DNS resolution is pinned to a validated address for the connection. Credentials in URLs are rejected. Scans use no browser cookies or authentication. One scan runs at a time. This local utility has not been hardened for public hosting; a public deployment needs authentication, quotas, and infrastructure-level outbound network restrictions.

## Checks

```sh
ruby link-checker/test.rb
```

Tests cover extraction, normalization, private-network rejection, HTTP classification, and HEAD fallback. They use fixtures for destination status responses.

Files: [server.rb](server.rb), [public/index.html](public/index.html), [public/app.js](public/app.js), [public/style.css](public/style.css).

## Portfolio integration

The same server now serves the portfolio at **http://127.0.0.1:8081/** and LinkLens at **http://127.0.0.1:8081/link-checker/public/**. The portfolio’s Selected Work section links to the app; the app header links back. The launch command above is unchanged. Restart an older running server to enable these routes.

Static-only hosting cannot run scans; deploy the backend before offering the tool publicly.
