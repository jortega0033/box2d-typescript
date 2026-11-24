# Box2D in TypeScript

A planned offline project. Implementation has not started beyond a toolchain scaffold (`npm ci`, `npm test`). The repository currently contains the product plan, technical specification and implementation backlog.

## Program goal

Build a complete physics engine in TypeScript: the full 2D rigid-body core, then soft bodies, fluids, cloth and a 3D core, deterministic across machines, running tens of thousands of bodies in the browser.

The program is planned ([#21](https://github.com/jortega0033/box2d-typescript/issues/21)). Phase 1 is the current epic [#1](https://github.com/jortega0033/box2d-typescript/issues/1) and the only phase with tickets.

**Score.** Share of pinned reference scenes where the first 1,000 ticks stay within the stated tolerance of the native reference, with the bodies per frame at 60 Hz.

| Phase | Content | Hours (rough) | Issue |
|---|---|---|---|
| 1 | The current epic and its tickets | 51 to 73 | [#1](https://github.com/jortega0033/box2d-typescript/issues/1) |
| 2 | Full 2D core | 120 to 200 | [#22](https://github.com/jortega0033/box2d-typescript/issues/22) |
| 3 | Determinism and speed | 120 to 220 | [#23](https://github.com/jortega0033/box2d-typescript/issues/23) |
| 4 | Beyond rigid bodies | 130 to 230 | [#24](https://github.com/jortega0033/box2d-typescript/issues/24) |
| 5 | 3D core | 180 to 320 | [#25](https://github.com/jortega0033/box2d-typescript/issues/25) |
| 6 | Tools | 100 to 170 | [#26](https://github.com/jortega0033/box2d-typescript/issues/26) |

About 700 to 1210 engineer hours in total: rough estimates, not measurements. The numbers in the score and the finish lines are targets until a run shows them. Only phase 1 has tickets to work; the sub-issues of a later phase are written when it starts. No single session is expected to reach the end.

## Plan

- [Full product plan and acceptance criteria](docs/PRD.md)
- [Technical specification and verification fixtures](docs/TECHNICAL_SPEC.md)
- [Implementation epic](https://github.com/jortega0033/box2d-typescript/issues/1)

## Current status

The fixtures describe expected results for future checks. No working baseline or passing implementation tests are claimed. Required runtime versions and offline dependencies must be checked before the first build.

## Licensing

A license for this project has not been selected. Any upstream reference or adapted code must retain its applicable notices; see the plan.
