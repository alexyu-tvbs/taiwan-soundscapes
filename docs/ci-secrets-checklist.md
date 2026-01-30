# CI Secrets Checklist

## Required Secrets

This project is a **static SPA prototype** with no backend. No secrets are required for the current CI pipeline.

## Optional Secrets

| Secret | Purpose | Where to Configure |
|--------|---------|-------------------|
| `SLACK_WEBHOOK` | Failure notifications to Slack | Repo → Settings → Secrets → Actions |
| `VERCEL_TOKEN` | Automated deployment (if added) | Repo → Settings → Secrets → Actions |

## Adding Secrets

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Enter name (e.g., `SLACK_WEBHOOK`) and value
4. Click **Add secret**

## Security Best Practices

- Never commit secrets to the repository
- Use GitHub's secret masking (secrets are automatically masked in logs)
- Rotate secrets periodically
- Use environment-scoped secrets for production deployments
- Review Actions logs to ensure no accidental secret exposure
