# Owner decisions

Every decision the owner made for this repository, so the rules do not depend on anyone's memory of a conversation. Changing any entry needs the owner. An agent that finds a decision blocking a ticket stops and says so.

All entries are dated 2026-11-22, except entries 13 to 15 (2026-11-23).

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
| 11 | Rust (where present) is verified in CI only. Not applicable: this repository has no Rust; the native Box2D reference step is likewise verified in CI only. | `CLAUDE.md`; `.github/workflows/reference.yml` (installed with the kit, guarded on `reference/CMakeLists.txt`; no ticket edits CI) |
| 12 | The ten UI rules in `docs/ui-quality.md` are binding; the `ui-ux-pro-max` and `unslop` skills are installed and used for UI work and copy. | `docs/ui-quality.md`, `.claude/skills/ui-ux-pro-max/`, `.claude/skills/unslop/` |
| 13 | Visual system: Pipenzo Flow look tokens (docs/design-tokens.md). SDLC kit version: jortega0033/sdlc-kit v1.0.0. (2026-11-23) | `docs/design-tokens.md`, `public/tokens.css` |
| 14 | UI token rules, 2026-11-23. The labels 14-D1 to 14-D4 are separate from D1 to D15 of entry 10. 14-D1 Current selection: the yellow accent is used for the primary action, the current-step marker and the current selection (UI rule 8); decided by the owner. How (recommended by the orchestrator, adopted under the owner's delegation of the same day): a selection uses a solid `--primary` fill with `--on-primary` text (not only a yellow border, which has about 1.5:1 against white on light), plus a second sign that is not colour (weight, icon or text) and the existing aria attribute; never a tint with a same-hue border and never a thick one-sided border. 14-D2 Focus ring: `--focus` is a focus indicator, exempt from the accent limit, including where it is yellow in dark; a ticket that says the focus style stays unchanged means the rule on main after the token pull request (recommended by the orchestrator, adopted under the owner's delegation of 2026-11-23). 14-D3 Themes: contrast and no-colour-alone checks cover both the light and the dark block of `tokens.css` (recommended by the orchestrator, adopted under the owner's delegation of 2026-11-23). 14-D4 Linking: a ticket that creates a page or its static allowlist links `tokens.css` before any other stylesheet and serves it (allowlist and its test) (recommended by the orchestrator, adopted under the owner's delegation of 2026-11-23). | `docs/design-tokens.md`, `docs/ui-quality.md` |
| 15 | CI, 2026-11-23: the path filter of `reference.yml` is removed, because `native traces` is a required check and never started on most pull requests (#19). | `.github/workflows/reference.yml` |

## Entry 10: decisions settled with the ticket default

Issue numbers: B2-07 and B2-08 are new tickets whose numbers GitHub assigns on creation; the epic text lists the numbers. Plan IDs: B2-01 = #2, B2-02 = #3, B2-03 = #4, B2-04 = #5, B2-05 = #6, B2-06 = #7.

- D1 (epic #1): no LICENSE file is added; README keeps "has not been selected". Not blocking any ticket. The Box2D MIT notice is kept in `reference/` regardless.
- D2 (#2, B2-01): minimum Node 22 (v22.23.4 observed on the dev machine), set in `package.json` `engines` and README; no claim for other versions.
- D3 (#2): TypeScript compiler is the exact version `npm view typescript version` reports when #2 starts (7.0.2 on 2026-11-22), pinned without a range; it is the only devDependency. Strict mode, ES modules, target ES2022.
- D4 (#2): test runner is `node:test` and `node:assert` on the compiled output; no test package.
- D5 (#2, #6): no browser automation package; view logic is a DOM-free view model tested in Node; the Chrome walkthrough is documented and listed under "Owner checks".
- D6 (#2): default port 8281; `--port 0` picks a free port and prints the URL; binds `127.0.0.1` only.
- D7 (B2-08, new): native harness in C against Box2D v3.1.1 sources fetched by commit in CI (not vendored), built with CMake on `ubuntu-latest`; reference traces are generated in CI and committed through the ticket's pull request; no native build on the owner's PC. The workflow `.github/workflows/reference.yml` is installed with the kit and skips itself until `reference/CMakeLists.txt` exists; the ticket adds the harness and `reference/generate.sh`, and no ticket edits CI.
- D8 (#3, B2-02): tolerances are 0.02 m position, 0.05 rad wrapped angle, sensor events exact with at most one outer tick of drift, frozen in `fixtures/tolerances.json`; changing one after the freeze needs a comment on the epic.
- D9 (#7, B2-06): held-out set is six original scenes from a seeded generator (seed 20261122), committed before any reference trace for them exists and never used to tune slop or tolerances.
- D10 (#2, B2-07): trace and scene files are JSON, UTF-8, fixed key order from `docs/scene-format.md`, numbers as the shortest round-trip text of the Float32 value, bodies by ascending ID, no `-0`; the canonical hash is SHA-256 of the exact bytes.
- D11 (#2): four fixed substeps per 1/60 s tick from the first ticket on.
- D12 (B2-07, new): diagnostic codes are named `E_<AREA>_<NAME>`, each with a JSON path, listed in `docs/diagnostics.md`.
- D13 (#6, B2-05): speed control values 0.25x, 0.5x, 1x, 2x, 4x; speed changes only how many ticks play per displayed frame.
- D14 (#3, B2-02): friction and restitution mixing follow Box2D v3.1.1 (geometric mean for friction, maximum for restitution), checked against the pinned `docs/simulation.md`; deviations are recorded in `docs/engine-contract.md`.
- D15 (#7, B2-06): a fixture that exceeds a tolerance is kept and reported in `docs/reference-findings.md` with its measured error and a diagnosis; tolerances and slop are not tuned on held-out scenes.

## Program decisions (owner, 2026-11-24)

The owner accepted the goal and each suggestion below. They apply from the phase they name; the rules of `CLAUDE.md` hold for phase 1 as written.

| Decision | Implemented in |
|---|---|
| The repository has a program goal above phase 1: a complete physics engine in TypeScript, in six phases. | Program issue #21 |
| The repository name ties it to one engine. Suggested: keep the name and describe the goal in the README. | Program issue #21 |
| Reference traces come from the MIT-licensed native engine. Suggested: pin a release and keep its notice. | Program issue #21 |
