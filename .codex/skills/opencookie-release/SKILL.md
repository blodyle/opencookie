---
name: opencookie-release
description: Prepare an OpenCookie manual release. Use when the user asks to release OpenCookie, bump @opencookie/react, prepare npm/GitHub release files, update changelog/readmes/package metadata, commit release prep, or explain the manual GitHub Actions release flow for this repository.
---

# OpenCookie Release

Use this skill only inside the OpenCookie repo. Keep the release prep small, explicit, and compatible with the existing manual GitHub Actions release workflow.

## Release Rules

- Use Yarn, not pnpm.
- Keep OpenCookie frontend-only and dependency-light.
- Do not make legal compliance guarantees in release notes or docs.
- Do not create local git tags manually. `.github/workflows/release.yml` creates and pushes the tag during the real release.
- Do not run the GitHub release workflow yourself unless the user explicitly asks. Prepare the repo, commit, and tell the user how to run the manual workflow.
- Use `latest` only for stable versions with no prerelease suffix. Use `alpha` for versions like `0.2.0-alpha.0`.

## Checklist

1. Inspect the current state:
   - Run `git status --short --branch`.
   - Read `packages/react/package.json`, root `package.json`, `examples/next-app-router/package.json`, `CHANGELOG.md`, root `README.md`, and `packages/react/README.md` if it exists.
   - Check `.github/workflows/release.yml` if release behavior matters.

2. Pick the next version:
   - If the user named a version, use it unless it conflicts with npm or semver.
   - Otherwise choose:
     - patch for fixes/docs/polish, such as `0.1.0` -> `0.1.1`;
     - minor for additive public API/features, such as `0.1.1` -> `0.2.0`;
     - prerelease only when the user wants alpha/beta/canary.
   - When network is available, verify the version is unused with:
     `npm view @opencookie/react@<version> version`
   - If npm already has the version, bump again before committing.

3. Update release files:
   - `packages/react/package.json` version.
   - root `package.json` version.
   - `examples/next-app-router/package.json` version and `@opencookie/react` dependency.
   - `CHANGELOG.md` with a concise entry above the previous release.
   - Root `README.md` and `packages/react/README.md` if install commands, badges, examples, demo links, or public API docs changed.

4. Validate:
   - Run `yarn install --ignore-scripts` if package versions or workspace dependency versions changed.
   - Run `yarn test`.
   - Run `yarn typecheck`.
   - Run `yarn typecheck:example`.
   - For UI/demo changes, also run `GITHUB_PAGES=true yarn build:example` when practical.
   - For package-release confidence, run `yarn build` and optionally `npm pack --dry-run` from `packages/react`.

5. Review the diff:
   - Run `git diff --stat`.
   - Run `git diff --` for changed release files.
   - Confirm the changes are only release-prep changes unless the user explicitly asked for more.

6. Commit:
   - Stage only release-prep files.
   - Commit with `Prepare <version> release`, for example `Prepare 0.1.1 release`.
   - Push only if the user asked for the branch to be pushed or the manual release needs the commit on `main`.

## Final Instructions To User

After committing, report:

- the commit hash and version prepared;
- the checks run and whether they passed;
- whether the branch was pushed;
- exact manual release steps.

Manual release steps should be:

1. Open GitHub Actions -> `Release`.
2. Select branch `main`.
3. Choose npm dist-tag:
   - `latest` for stable versions like `0.1.1`;
   - `alpha` for prerelease versions like `0.2.0-alpha.0`.
4. First run with `dry-run` checked.
5. If dry run passes, run again with `dry-run` unchecked.
6. Confirm npm, GitHub Releases, and GitHub Pages demo updated.
