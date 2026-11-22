# Releasing

Only the owner releases. Agents never tag, publish or create a release.

There is no release yet: the repository is planning-only. A release here means a tagged commit on `main` of the offline engine, CLI and viewer, with no package published (the project is not an npm package).

## Steps (owner)

1. `main` is green on CI (Linux and Windows) and every ticket of epic #1 that the release covers is merged.
2. On a clean checkout of `main`, run `npm ci`, `npm test`, and the reference comparison from the run guide (`node dist/cli/main.js compare ...`, planned, introduced by the epic tickets) and confirm they pass. Complete the Chrome walkthrough in `docs/run-guide.md` and record the Chrome version.
3. Check that `reference/` still carries the Box2D v3.1.1 commit and its MIT notice, and that every divergence is listed in `docs/reference-findings.md`.
4. Move the `Unreleased` entries in `CHANGELOG.md` under a new version heading with the date, in a pull request, and merge it.
5. Tag the merge commit (`git tag -a vX.Y.Z`), push the tag and create the GitHub release from the changelog text.

A licence has not been selected (owner decision D1 in epic #1); settle it before the first public release.
