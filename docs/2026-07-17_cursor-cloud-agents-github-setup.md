# David Glazier
## Cursor Cloud Agents — GitHub Repo Setup
Date: July 17, 2026

## Change Descriptions
- Initialized a git repository for the portfolio project and pushed it to GitHub so Cursor Cloud Agents can clone and work on it in a remote VM.
- Tracked the deployable site (`website/`), change docs (`docs/`), and asset tooling (`tools/`).
- Excluded large raw source media (`assets/`, `Site files/`, root `Fonts/`, `Logo/`) so the remote stays within GitHub size limits and Cloud Agents stay fast to spin up.

## Technical Explanations
- Cursor Cloud Agents run against a **GitHub remote**, not a local-only folder. Uncommitted or un-pushed work is not available to the cloud VM.
- `.gitignore` uses rooted paths (`/Fonts/`, `/Logo/`, etc.) so Windows case-insensitive matching does not accidentally ignore `website/fonts/`.
- Repo is public under `Epicdavid12/portfolio`, default branch `main`.

## How to use with Cursor Cloud Agents
1. In Cursor, confirm GitHub is connected (Settings → Account / Integrations).
2. Open **Cloud Agents** and select **Epicdavid12/portfolio**.
3. Start an agent on `main` (or a new branch). Push local commits first if you want the cloud agent to see them.

## File Location Tracking
No source files were moved between branches. New remote: local Portfolio folder → `https://github.com/Epicdavid12/portfolio`.

## Communication Context
Owner-only setup (David Glazier). No other team member code was modified.

# File Locations
| File / Asset | Path |
|--------------|------|
| Git ignore | `.gitignore` |
| Root readme | `README.md` |
| Site | `website/` |
| Docs | `docs/` |
| Tooling | `tools/` |
| GitHub remote | `https://github.com/Epicdavid12/portfolio` |
