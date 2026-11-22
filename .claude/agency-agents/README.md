# Agency Agents roles used in this repository

The Markdown files in `.claude/agents/` whose names start with `engineering-`, `security-` or `testing-` are copies of role definitions from Agency Agents. They are project-local Claude Code subagents. The file `loop-verifier.md` in the same folder is not from Agency Agents; it belongs to the Loop Engineering setup described in [`LOOP.md`](../../LOOP.md). Local change to it: the scaffold ships it without a `tools:` line, so `tools: Read, Grep, Glob` was added and it is read-only.

## Source and licence

- Upstream: https://github.com/msitarzewski/agency-agents
- Pinned revision: `8ae6164602c95ca78828b148b9052460ee426885` (upstream `main`, committed 2026-11-09)
- Licence: MIT, "Copyright (c) 2025 AgentLand Contributors". The upstream licence text at the pinned revision is kept unchanged in [`LICENSE`](LICENSE) next to this file (SHA-256 `9a45258434d5cedf0af73c9ad4771373701225038d246c49219026c33677f66f`). It covers only the copied role files, not the rest of this repository.
- Fetched with `gh api -H "Accept: application/vnd.github.raw" "repos/msitarzewski/agency-agents/contents/<path>?ref=<revision>"`.

## Installed roles

"Upstream SHA-256" is the hash of the file as fetched at the pinned revision. Reviewer roles have one added frontmatter line, `tools: Read, Grep, Glob`, so they cannot edit files or run commands. Nothing else in any file was changed by the install step.

| File in `.claude/agents/` | `name:` | Upstream path | Upstream SHA-256 | Local change |
|---|---|---|---|---|
| `engineering-software-architect.md` | Software Architect | `engineering/engineering-software-architect.md` | `b85121691776147bacde26673e68fbbacd6a7f0816d1ca8e203c264d25ce1d30` | added `tools: Read, Grep, Glob` |
| `engineering-code-reviewer.md` | Code Reviewer | `engineering/engineering-code-reviewer.md` | `7509fcc3ea1dda46511b2801996305bf3d4a125576f9655ff0b63df25602f446` | added `tools: Read, Grep, Glob` |
| `engineering-codebase-onboarding-engineer.md` | Codebase Onboarding Engineer | `engineering/engineering-codebase-onboarding-engineer.md` | `07aa548b45887c3ad768efad5fdbf6e57bea639df4f1b74c7e383142f454e2a1` | added `tools: Read, Grep, Glob` |
| `security-appsec-engineer.md` | Application Security Engineer | `security/security-appsec-engineer.md` | `a19f0bda46f4adca5737365dbc3c7ed93e9d93b71349536d92ff055dcf4e3b83` | added `tools: Read, Grep, Glob` |
| `testing-accessibility-auditor.md` | Accessibility Auditor | `testing/testing-accessibility-auditor.md` | `362935907af23839775b9c6162f38c0c5a740542ab4350cb5c5b5a0d9f9a4268` | added `tools: Read, Grep, Glob` |
| `testing-reality-checker.md` | Reality Checker | `testing/testing-reality-checker.md` | `6d32fcdb114233e13902ec6372d50293b120e85d490b5e81d372c29808f988a1` | added `tools: Read, Grep, Glob` |
| `engineering-frontend-developer.md` | Frontend Developer | `engineering/engineering-frontend-developer.md` | `1ae4cc10b2e0163bd3ed921ad54080b865cd02e591becd8919b64b73fab06dad` | none |
| `testing-test-automation-engineer.md` | Test Automation Engineer | `testing/testing-test-automation-engineer.md` | `4299d038e88387546d645ccbe767b1dfdb7de10da55eba1ab103149972cd2b9b` | none |

## Why these roles

| Role | Use in this repository |
|---|---|
| Software Architect (read-only) | Check a ticket's design against the module map in [`docs/architecture.md`](../../docs/architecture.md) and the technical specification before code is written: the trace and scene formats, the one-integrator rule for the engine step, the independence of the comparison from the engine. |
| Code Reviewer (read-only) | Review a diff for correctness, missed edge cases and broken rules (determinism, canonical order, Float32 and negative-zero handling, caps checked before allocation, offline rules). |
| Codebase Onboarding Engineer (read-only) | Trace a code path once code exists and report facts with file and line citations. |
| Application Security Engineer (read-only) | Review the places where untrusted input meets the program: scene and trace import (byte, body, joint and tick caps before allocation, malformed input), the loopback static server (bind address, path handling) and the rendering of imported text in the viewer. |
| Accessibility Auditor (read-only) | Review keyboard operation of play, pause, step, restart, scrub and speed controls, visible focus, and the text status for tick, selected body, events and comparison, which the PRD makes requirements. |
| Reality Checker (read-only) | Compare each acceptance criterion with the evidence that was actually produced before a ticket is called done. |
| Frontend Developer | Implement work in `src/web/` and `public/`: Canvas 2D viewer, controls, inspector. |
| Test Automation Engineer | Write the `node:test` suites, fixtures and any later browser smoke run in `test/` and `fixtures/`. |

Most of these roles are written for larger stacks. Frontend Developer and Test Automation Engineer mention frameworks and browser-automation packages; Application Security Engineer describes scanners and pipelines. In this repository the rules in [`CLAUDE.md`](../../CLAUDE.md) win: TypeScript compiled by one pinned compiler, no bundler, no runtime dependency, Canvas 2D, `node:test`, no external requests.

Roles that were considered and left out: Backend Architect, Database Optimizer and API Tester (no database or service API; the only server serves static files), Performance Benchmarker (the plan sets no performance budget), UI Designer and UX Architect (the interface is a single viewer; Frontend Developer and Accessibility Auditor cover it, and this can be revisited), Technical Writer, Rust Refactoring Specialist and Embedded Firmware Engineer (no matching work; the native harness is a small test-only component).

## Name collision with user-level agents

A developer who has installed Agency Agents in `~/.claude/agents/` already has agents with the same `name:` values. Claude Code gives the project-level definition precedence, so inside this repository the copies here are used, including the read-only tool limits. The upstream names were kept on purpose so that the roles stay recognisable and can be compared with upstream.

A Claude Code session that was already running when these files were added keeps the definitions it loaded at start. Start a new session to pick up the project copies.

## Check that the roles load

From the repository root, in a new session:

```text
claude -p "List the project-level subagents defined in .claude/agents with the tools each one may use."
```

The six reviewer roles and `loop-verifier` must report exactly `Read, Grep, Glob`. The check was run once on 2026-11-22; see "Load check of the project agents and skills" at the end of this file.

## Updating

Fetch the same paths at a newer revision, re-apply the `tools:` line to the six reviewer roles, and update the revision and hashes in this file in the same commit.

## Local change: automatic delegation (2026-11-22)

One sentence beginning "Use proactively" was appended to the `description:` line of every Agency Agents role in `.claude/agents/` (not to `loop-verifier`). Claude Code uses that field to decide when to delegate, so the roles now run during ticket work without being named. Nothing else in the role files changed.

This supersedes any statement above that a role file is unmodified or that the `tools:` line is the only local change. To compare a role with the pinned upstream file, remove that sentence (and the `tools:` line where one was added) first.

The steps at which each role runs are in `.claude/skills/implement-ticket/SKILL.md`.

A section headed "In this repository" was then inserted directly after the frontmatter of every Agency Agents role (not into `loop-verifier`), before the upstream text. It is project-specific text written for this repository, not upstream text. Because the repository has no application code yet, each section describes the planned stack, modules and commands from the technical specification and says they are planned. Each section ends with the sentence "This section and CLAUDE.md override the generic text below wherever they differ." The upstream text below it and the rest of the frontmatter are unchanged.

To compare a role with the pinned upstream file, remove the "Use proactively" sentence (and the full stop added in front of it where the upstream description has none), the section "In this repository" together with the blank line after it, and the `tools:` line where one was added. Re-check the sections against the code once it exists.

## SDLC kit changes (2026-11-22)

- Code Reviewer, Frontend Developer, Accessibility Auditor and Reality Checker now name `docs/ui-quality.md` in their "In this repository" checklists; Reality Checker also names `.github/workflows/ci.yml` and says green CI is checked by the driver, not by the role.
- The review gate hook `.claude/hooks/role-gate.mjs` lists the gate roles `Code Reviewer` and `Reality Checker` (exact `name:` values above). Both are installed with `tools: Read, Grep, Glob`.
- The `implement-ticket` playbook and the new `next-ticket` driver follow the gate, pull request and CI order in `CLAUDE.md`. `ui-ux-pro-max` and `unslop` are installed under `.claude/skills/` with their own `PROVENANCE.md`.

### Load check of the project agents and skills (2026-11-22)

Run once from the worktree root: `claude -p "List every project subagent in .claude/agents with its name and tools, say whether each starts with a section titled In this repository, and list the project skills." --model haiku` (Claude Code 2.1.323). Observed result:

- Nine project subagents listed. Software Architect, Code Reviewer, Codebase Onboarding Engineer, Application Security Engineer, Accessibility Auditor, Reality Checker and `loop-verifier` show `Read, Grep, Glob`; Frontend Developer and Test Automation Engineer show no `tools:` line. The eight Agency Agents roles each start with "In this repository"; `loop-verifier` does not.
- Eight project skills listed: implement-ticket, next-ticket, ui-ux-pro-max, unslop, issue-triage, loop-budget, loop-constraints, loop-intake.
- The run also printed that this workspace is not trusted yet, so `permissions.allow` was ignored in that headless run (trust is a per-machine step for the owner), and five lines saying `Write(**/.claude/...)` ask rules are not matched by file permission checks, only `Edit(...)` rules are. The kit `settings.node.json` carries those `Write` lines unchanged; the matching `Edit` rules are present and cover file-editing tools.
