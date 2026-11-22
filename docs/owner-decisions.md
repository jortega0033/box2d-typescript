# Owner decisions

Every decision the owner made for this repository, so the rules do not depend on anyone's memory of a conversation. Changing any entry needs the owner. An agent that finds a decision blocking a ticket stops and says so.

All entries are dated 2026-11-22.

| # | Decision | Implemented in |
|---|---|---|
| 1 | The instructions, tooling and playbook live on the default branch. | `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.github/`, `docs/` |
| 2 | Persona agents run automatically during ticket work and carry instructions tailored to this project. | `.claude/agents/` ("In this repository" sections), `.claude/skills/implement-ticket/SKILL.md`, `.claude/agency-agents/README.md` |
| 3 | Every open ticket is about app implementation; tooling is installed, not ticketed. | Epic #1 and its tickets; tooling in `.claude/` and `.github/` |
| 4 | Agents may take a ticket up to a ready pull request. Only the owner merges and releases. | `CLAUDE.md` (Git workflow, Delivery workflow), `.claude/skills/next-ticket/SKILL.md`, `.claude/settings.json` (deny rules), `docs/RELEASING.md` |
| 5 | No scheduler. Ticket work starts only on the owner's go signal (`/next-ticket`), because the repository is used to train AI models. | `.claude/skills/next-ticket/SKILL.md` (`disable-model-invocation: true`), `LOOP.md` |
| 6 | A review gate hook blocks opening or readying a pull request until the gate roles have run after the last code edit. | `.claude/hooks/role-gate.mjs`, `.claude/settings.json` (hooks) |
| 7 | Loop Engineering stays at L1, report-only and unscheduled. | `LOOP.md`, `loop-constraints.md` |
| 8 | Continuous integration runs on Linux and Windows; the default branch requires a pull request and green checks. | `.github/workflows/ci.yml`; branch protection is set on GitHub after the merge |
| 9 | Permission rules: documented commands are allowed; force pushes, pushes to the default branch, merges, releases and reads of secrets are denied; edits to CI, agent configuration and Loop files ask first. | `.claude/settings.json` |
| 10 | Open decisions on tickets are settled with the ticket's stated default (list below). | Epic #1 "Owner decisions" and each ticket |
| 11 | Rust (where present) is verified in CI only. Not applicable: this repository has no Rust; the native Box2D reference step is likewise verified in CI only. | `CLAUDE.md`; the CI step arrives with ticket B2-08 |
| 12 | The ten UI rules in `docs/ui-quality.md` are binding; the `ui-ux-pro-max` and `unslop` skills are installed and used for UI work and copy. | `docs/ui-quality.md`, `.claude/skills/ui-ux-pro-max/`, `.claude/skills/unslop/` |

## Entry 10: decisions settled with the ticket default

Issue numbers: B2-07 and B2-08 are new tickets whose numbers GitHub assigns on creation; the epic text lists the numbers. Plan IDs: B2-01 = #2, B2-02 = #3, B2-03 = #4, B2-04 = #5, B2-05 = #6, B2-06 = #7.

- D1 (epic #1): no LICENSE file is added; README keeps "has not been selected". Not blocking any ticket. The Box2D MIT notice is kept in `reference/` regardless.
- D2 (#2, B2-01): minimum Node 22 (v22.23.4 observed on the dev machine), set in `package.json` `engines` and README; no claim for other versions.
- D3 (#2): TypeScript compiler is the exact version `npm view typescript version` reports when #2 starts (7.0.2 on 2026-11-22), pinned without a range; it is the only devDependency. Strict mode, ES modules, target ES2022.
- D4 (#2): test runner is `node:test` and `node:assert` on the compiled output; no test package.
- D5 (#2, #6): no browser automation package; view logic is a DOM-free view model tested in Node; the Chrome walkthrough is documented and listed under "Owner checks".
- D6 (#2): default port 8281; `--port 0` picks a free port and prints the URL; binds `127.0.0.1` only.
- D7 (B2-08, new): native harness in C against Box2D v3.1.1 sources fetched by commit in CI (not vendored), built with CMake on `ubuntu-latest`; reference traces are generated in CI and committed through the ticket's pull request; no native build on the owner's PC. The ticket adds one workflow file, so the implementing session asks the owner before editing CI and records the answer in the pull request.
- D8 (#3, B2-02): tolerances are 0.02 m position, 0.05 rad wrapped angle, sensor events exact with at most one outer tick of drift, frozen in `fixtures/tolerances.json`; changing one after the freeze needs a comment on the epic.
- D9 (#7, B2-06): held-out set is six original scenes from a seeded generator (seed 20261122), committed before any reference trace for them exists and never used to tune slop or tolerances.
- D10 (#2, B2-07): trace and scene files are JSON, UTF-8, fixed key order from `docs/scene-format.md`, numbers as the shortest round-trip text of the Float32 value, bodies by ascending ID, no `-0`; the canonical hash is SHA-256 of the exact bytes.
- D11 (#2): four fixed substeps per 1/60 s tick from the first ticket on.
- D12 (B2-07, new): diagnostic codes are named `E_<AREA>_<NAME>`, each with a JSON path, listed in `docs/diagnostics.md`.
- D13 (#6, B2-05): speed control values 0.25x, 0.5x, 1x, 2x, 4x; speed changes only how many ticks play per displayed frame.
- D14 (#3, B2-02): friction and restitution mixing follow Box2D v3.1.1 (geometric mean for friction, maximum for restitution), checked against the pinned `docs/simulation.md`; deviations are recorded in `docs/engine-contract.md`.
- D15 (#7, B2-06): a fixture that exceeds a tolerance is kept and reported in `docs/reference-findings.md` with its measured error and a diagnosis; tolerances and slop are not tuned on held-out scenes.
