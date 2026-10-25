# Deploy with GitHub's Run workflow button

The [Deploy LinkLens to Zoho workflow](../.github/workflows/deploy-linklens.yml) builds and checks the app on GitHub's Linux runner, then uploads its local container image directly to AppSail using the Catalyst CLI. No Docker installation on your Mac or Docker Hub account is needed for this route.

Status: workflow prepared, not yet run against your Zoho account. The first authenticated run must verify the CLI upload and assigned app URL. It does not automatically publish the portfolio or promote Catalyst Development to Production.

## One-time setup

1. Commit and push the workflow and app files to the GitHub repository's **default branch** (normally `main`). GitHub only shows the Run workflow control after a `workflow_dispatch` workflow exists on the default branch.
2. Create or choose your LinkLens project in Catalyst.
3. Generate a Catalyst token on a computer with Node.js installed:

   ```sh
   npm install --global zcatalyst-cli
   catalyst login
   catalyst token:generate
   ```

   Select the same data center as your Catalyst project. Authenticate in the browser when prompted. Do not put the token in your repository, workflow file, or chat.
4. Open **GitHub repository → Settings → Secrets and variables → Actions**.
5. Under **Secrets**, add `CATALYST_TOKEN` with the generated token.
6. Under **Variables**, add:

   | Name | Value |
   | --- | --- |
   | `CATALYST_PROJECT_ID` | Project ID from your Catalyst project settings |
   | `CATALYST_ORG_ID` | Organization ID from Catalyst (also in the console URL after `/baas/`) |
   | `CATALYST_DC` | Your account's data center: `us`, `eu`, `in`, `jp`, `sa`, `au`, or `ca` |
   | `APPSAIL_NAME` | Optional: `linklens` by default; reuse the same name for updates |

## Click to deploy

Open **Actions → Deploy LinkLens to Zoho → Run workflow**, select the branch, then click **Run workflow** again.

[Open this repository's deployment workflow](https://github.com/sauravra99/saurav-kumar-portfolio/actions/workflows/deploy-linklens.yml)

GitHub builds the Linux AMD64 image, runs the Ruby checks and HTTP smoke checks, then authenticates to Zoho and deploys. Inspect failed steps in the Actions log; never enable Catalyst `--verbose` in a public CI log because it can print authentication details.

## Complete the first deployment

1. In Catalyst, open the resulting AppSail service and find its HTTPS URL.
2. In its environment settings, set `PUBLIC_ORIGIN` to that exact origin without any path. For example, if the app is `https://assigned-host/link-checker/public/`, use `https://assigned-host`.
3. Keep the port at `9000` and `BIND_ADDRESS` at `0.0.0.0` (the image supplies both).
4. Apply the configuration and restart as required by the console. Check `/health`, open `/link-checker/public/`, and run a scan.
5. Check the active Catalyst environment. Complete Zoho's production publishing process and access/quota configuration before offering anonymous access broadly. Validate `PUBLIC_ORIGIN` again if the production URL differs.
6. Replace the portfolio's local launch link with the verified hosted app URL and its return link with the GitHub Pages portfolio URL.

GitHub Actions runs the deployment; Zoho hosts the app after the workflow finishes. The Actions runner is not a permanent web server. Review your GitHub Actions usage and Zoho hosting plan before running the workflow.

## References

- [Zoho standalone container deployment](https://docs.catalyst.zoho.com/en/cli/v1/deploy-resources/deploy-appsail/)
- [Catalyst token, project, organization and data-center flags](https://docs.catalyst.zoho.com/en/cli/v1/cli-options/)
- [Manually running GitHub workflows](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow)
