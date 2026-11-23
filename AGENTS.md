# AGENTS.md

The full repository instructions are in [CLAUDE.md](CLAUDE.md). This file repeats only what an agent needs before it reads that.

## State

Scaffold only: `npm ci`, `npm run build`, `npm run typecheck` and `npm test` work (smoke tests, no product behaviour). Other commands in `CLAUDE.md` are marked as planned and are introduced by named tickets. Do not report a planned command as working.

## Test commands

`npm test` builds with the pinned TypeScript compiler, then runs `node --test` on `test/**/*.test.mjs`, which import the compiled `dist/` output. The native Box2D reference step runs in CI only.

## Loop conventions

- The loop runs at L1: report-only, started by hand. It proposes; it does not label, comment, close, edit source, push or merge.
- No scheduler and no loop workflow is installed. Do not add one without the owner's approval.
- See [LOOP.md](LOOP.md) for the manual command and the human gates.
