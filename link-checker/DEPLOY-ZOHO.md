# Deploy LinkLens to Zoho Catalyst AppSail

Status: deployment files prepared; image build and cloud deployment have not been verified. Docker is not installed in the current development environment.

## Build the image

Install Docker and start its engine. Run from the portfolio repository root, replacing YOUR_DOCKERHUB_USERNAME with your own registry username:

```sh
docker build --platform linux/amd64 -f link-checker/Dockerfile -t YOUR_DOCKERHUB_USERNAME/linklens:1 .
docker run --rm -p 9000:9000 YOUR_DOCKERHUB_USERNAME/linklens:1
```

For local container scans, use port 9000 on both sides instead (`-p 9000:9000`), because the API validates the request host against its listening port. Open http://localhost:9000/link-checker/public/.

After verifying the image locally, publish it to your registry:

```sh
docker login
docker push YOUR_DOCKERHUB_USERNAME/linklens:1
```

Publishing to a public registry makes the bundled portfolio and app code publicly downloadable. Choose a private repository if appropriate.

## Configure AppSail

1. Open or create a Catalyst project.
2. Open **Serverless → AppSail → Deploy from Console**.
3. Select **Docker Image**, choose Docker Hub, and connect your registry through Zoho's integration UI.
4. Select the published `YOUR_DOCKERHUB_USERNAME/linklens:1` image.
5. Use port **9000**. The image supplies the startup command (`ruby link-checker/server.rb`).
6. Use environment variables `PORT=9000` and `BIND_ADDRESS=0.0.0.0` (also set in the image).
7. Once Zoho assigns the app URL, set `PUBLIC_ORIGIN` to its exact HTTPS origin, with no path (for example, `https://YOUR_ASSIGNED_HOST`). Restart the service after changing configuration. Scans remain restricted until the correct origin is configured.
8. Verify `/health`, then open `/link-checker/public/` and scan a public HTML page. Check redirects and timeout handling through Zoho's gateway before publishing the link.

Keep the app UI and API on the same Zoho origin; no cross-origin API permissions are needed. If Zoho rewrites the Host header, inspect its documented proxy behavior before changing the explicit allowlist; do not disable host validation.

## Connect the GitHub portfolio

After verifying the deployment, replace the portfolio's local-launch action with the actual HTTPS app URL ending in `/link-checker/public/`. Update the app's return link to the GitHub Pages portfolio URL. The current local instructions remain unchanged until a working hosted URL is available.

## Before broad public use

This utility limits scans to 100 links and one active scan per instance and rejects local/private destinations. Configure access controls and request quotas at the hosting gateway before opening anonymous scanning broadly. Review the chosen Zoho plan and request timeout; a scan can take approximately 72 seconds. No hosting plan has been purchased or selected by these changes.

Official references:
- [AppSail custom runtime support and Linux AMD64 requirement](https://docs.catalyst.zoho.com/en/serverless/help/appsail/introduction/)
- [Deploy a Docker image from the console](https://docs.catalyst.zoho.com/en/serverless/help/appsail/custom-runtimes/deploy-from-console/)

## Prefer a GitHub Actions button?

Use [Deploy with GitHub Actions](DEPLOY-GITHUB.md). It builds the container on GitHub and uploads it directly to AppSail, without requiring Docker locally or publishing the image to Docker Hub.
