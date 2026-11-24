# Box2D in TypeScript

> This document specifies phase 1 of the program in [#21](https://github.com/jortega0033/box2d-typescript/issues/21). Hour figures in it are early estimates for that phase; its open tickets add up to 51 to 73 hours (2026-11-24). Work that it defers is planned in the later phases only where the program names it.

Engineering plan. Prototype, reference fixture generation, and implementation checks are pending. The batch estimates **13–19 engineering hours** across six tickets.

## Product requirements

### User and outcome

A TypeScript developer who needs to understand a 2D physics problem can load an original scene, run it with a fixed time step, pause at a specific tick, and inspect transforms, contacts, sensor events, and constraint errors. A failed comparison identifies the first mismatching body and tick with enough context to reproduce it locally.

The first usable slice opens the bundled falling-disc scene in the browser, steps a real simulation, and replays the resulting transforms. The complete batch adds convex boxes, friction, persistent contacts, one bounded continuous-collision mode, sensors, two joint types, and a reference comparison command.

### Scope

- Run locally in Chrome and a headless Node CLI. Use TypeScript for the engine and Canvas 2D for the viewer. Stage a pinned compiler and its dependencies before the offline run if the target has none. Serve the compiled assets from a local server. Runtime assets and fixtures come from the repository.
- Support static and dynamic rigid bodies, circles, and convex rectangles. Support discrete circle–circle, circle–rectangle, and rectangle–rectangle contacts, rectangular sensors with circle or rectangle visitors, distance joints, and passive revolute joints. The continuous-collision slice covers a moving circle against a **nonrotating static rectangle**. Other fast-body pairs use the discrete path and an explicit capability flag.
- Start with one fixture per interaction, followed by a seeded set of non-chaotic scenes. Match agreed observables against a pinned Box2D build for the supported cases. Full API compatibility, an editor, general convex polygons, sleeping, arbitrary moving-body continuous collision detection, and multiplayer are outside this epic.
- Provide accessible play, pause, single-step, restart, scrub, and speed controls. Keep current tick, selected body, events, and comparison status available in text. Keyboard controls must remain usable while playback is paused and errors must leave the last valid scene intact.

### Success criteria

On a clean offline run, the user can open the demo, inspect a collision and a joint, and revisit the same tick after restarting. The headless runner reproduces its canonical output twice on the same supported runtime. The reference suite reports agreed event expectations and per-fixture numerical errors. It exits nonzero on a mismatch and names the first divergent tick, body, field, reference value, and observed value.

## Technical design

- **Packages.** The pure engine owns scene validation, stepping, and event emission. A shared trace codec owns the versioned scene and replay formats. CLI and browser both run the engine against the same fixtures. A separate native reference harness is the only component that links Box2D. It normalizes the reference's body IDs to scene IDs and exports the same trace fields. The browser renderer has no authority over simulation time.
- **Scene contract.** Version 1 JSON includes stable unsigned integer IDs, gravity, body type, shape dimensions, transform, velocity, mass or density, friction/restitution, optional sensor or bullet flag, and joint anchors. SI units and radians. Validate finite values, dimensions, enums, duplicate IDs, references, body limits, and input byte limits before building a world. For the first release cap scenes at 1 MiB, 128 bodies, 64 joints, and 1,000 ticks. Reject unsupported pairs with specific diagnostic codes. Preserve tick zero as initial state. A step creates tick one.
- **Clock and canonical order.** Use a 1/60-second outer tick. The solver uses four fixed substeps once contact constraints are introduced. Iterate bodies by ascending ID, contact pairs by ordered ID tuple, and joint constraints by ID. Define stable tie breaks for equal separation axes and simultaneous hits. Store solver-boundary values in Float32 precision using typed arrays or Math.fround. Normalize negative zero and reject non-finite state before trace serialization. Demonstrate repeatability on one runtime first and report Node/browser differences separately.
- **Contacts.** Start with analytic disc versus horizontal floor, then use a brute-force AABB broad phase at the capped scale and analytic circle tests plus separating axes and clipped features for rectangles. Define normals from the lower-ID body to the higher-ID body. Apply sequential impulses with inverse mass and rotational inertia, friction clamped by accumulated normal impulse, and limited penetration correction. Use stable shape-feature keys to warm-start persistent contacts. Clear cached impulses when a pair ends. Use a documented correction slop of 0.005 m as an initial setting, with any tuning recorded against a separately selected test split.
- **Overlap and high-speed steps.** Sensors participate in narrow-phase overlap tests and emit begin/end transitions at outer-tick boundaries. They never produce impulses. Continuous collision detection sweeps a circle center against the rounded Minkowski expansion of a static rectangle, including corner checks. The earliest time of impact wins with the collider ID as a tie break. Clamp progress and cap impacts per substep so degenerate contact cannot hang a simulation. Keep continuous hits separate from sensor overlaps. A transient sensor pass between discrete samples is outside scope.
- **Joints and trace.** Distance joints preserve an anchor separation and revolute joints bring two local anchors together while allowing rotation. Convert anchors to world space each substep. Reject missing, self, and static–static joint endpoints. Emit immutable per-tick poses, velocities, ordered events, and optional joint errors for a body inspector and replay scrubber. Use bounded trace length and validate it before the viewer allocates storage.
- **Source and licensing.** Reference Box2D v3.1.1 at commit `8c661469c9507d3ad6fbd2fea3f1aa71669c2fe3`. GitHub confirms the MIT license at this tag. Preserve copyright and license notices for any copied or adapted upstream code. Use original scene definitions and stage the license, commit, native build inputs, flags, single-worker settings, and fixture manifest. Generate checked reference traces on an authorized local host before a fully offline comparison. Version-scoped upstream documentation governs API behavior. [Release](https://github.com/erincatto/box2d/releases/tag/v3.1.1) · [MIT license](https://github.com/erincatto/box2d/blob/v3.1.1/LICENSE) · [Pinned simulation docs](https://github.com/erincatto/box2d/blob/v3.1.1/docs/simulation.md)

### Fixtures and acceptance checks

| Fixture | Check |
|---|---|
| Constant velocity | In zero gravity, a disc starts at x=0 with vx=3 m/s. After 60 ticks, x is 3 m within 0.0001 m. |
| Non-bouncing floor | A radius-0.5 m disc falls onto the top face at y=0 with zero restitution. At tick 240 the center is within 0.02 m of y=0.5 and absolute vertical speed is below 0.05 m/s. |
| Persistent contacts | An original box stack and an isolated glancing collision exercise angular response, friction, and stable feature keys. Inspect bounded resting penetration and repeatability. Freeze fixture tolerances before comparison with the held-out set. |
| Thin wall and sensor | A radius-0.1 m circle at x=−1 with vx=120 m/s travels 2 m per outer tick in zero gravity. It must not pass through a wall filling x=0 to x=0.05 across its path. A separate slow traversal emits one begin and one end event and keeps its original speed. |
| Distance and hinge | A 1 m link with no gravity and an initially small deviation reaches an anchor separation within 0.02 m of target. A passive hinge keeps world anchors within 0.02 m after an impulse while the body can rotate. |
| Import and replay | Reject unsupported shapes, invalid IDs, and non-finite values with actionable errors. Selecting tick zero shows the initial pose. Selecting an earlier tick and running again returns the same canonical trace for the same scene. |

Reference gates are proposed until the harness runs. Use original scenes with explicitly recorded step and substep counts, gravity, sleep settings, units, material rules, and body insertion order. Compare selected position checkpoints within a fixture-specific threshold initially set to 0.02 m and wrapped angular error within 0.05 rad for tested non-chaotic scenes. Compare sensor event identities and order exactly, allowing at most one outer tick of timing drift for the reference comparison if its sampling boundary differs. Treat first-hit and no-pass constraints as semantic assertions. Use a held-out scene set, and report fixture coverage and failures individually. The stricter 0.001 m target in the inspiration list remains a future investigation beyond this batch.

## Epic · Reproduce and explain a 2D physics scene offline

Deliver an original browser replayer and a deterministic TypeScript engine for the declared rigid-body subset. The epic is done when the fixed-tick demo works offline, the declared feature fixtures pass, and the reference comparison reports measured errors and semantic differences per scene.

| Ticket | Depends on | Estimate |
|---|---|---|
| B2-01 Fixed clock and replayable disc demo | — | 2–3 h |
| B2-02 Discrete contact solver and friction | B2-01 | 3–4 h |
| B2-03 Sensors and bounded circle sweep | B2-02 | 2–3 h |
| B2-04 Distance and revolute constraints | B2-02 | 2–3 h |
| B2-05 Replay inspector and diagnostics | B2-01 | 2–3 h |
| B2-06 Reference runner and integration | B2-03, B2-04, B2-05 | 2–3 h |

B2-05 can proceed against the versioned trace contract alongside B2-02. Once the solver hook is frozen, B2-03 and B2-04 own separate modules for overlap/sweep and joint constraints. Reserve engine-step wiring to one integrator. B2-06 owns test-only reference artifacts and the release gate.

### B2-01 Fixed clock and replayable disc demo

Build engine types, validation, integration, trace version 1, and a local single-scene browser viewer. Start with the disc and a static horizontal floor. Acceptance requires the constant-velocity and resting-floor checks above, deterministic trace bytes for two runs, and working pause, step, and restart controls. Verify with the offline headless fixture runner and a browser smoke run.

### B2-02 Discrete contact solver and friction

Add stable AABB candidate ordering, circle/rectangle contact manifolds, rotational inertia, clamped friction impulses, and warm-start cache invalidation. Acceptance requires stationary stack penetration within its documented fixture tolerance, a rotating box after an off-center impact, and stable feature/pair ordering for the same IDs regardless of JSON body order. Verify with stack, glancing collision, separated-contact, and coincident-center fixtures.

### B2-03 Sensors and bounded circle sweep

Implement sensor overlap transitions without impulses and continuous resolution for a bullet circle against nonrotating static rectangles. Acceptance requires the thin-wall and sensor checks, deterministic corner ties, and a clear unsupported diagnostic for a requested continuous pair outside the slice. Verify with a high-speed wall, a near-corner miss, and a slow sensor entry and exit.

### B2-04 Distance and revolute constraints

Implement shared constraint assembly for the two joint types and an error observable per constraint. Acceptance requires the distance and hinge checks, stability for a static anchor, and validation of invalid joint endpoints before the engine advances. Verify with an original pendulum, a two-body link, and negative scene fixtures.

### B2-05 Replay inspector and diagnostics

Add the keyboard-operable replay timeline, selected-body state, event list, and visible validation and comparison results. Use frozen trace fixtures so UI work can run in parallel with solver work. Acceptance requires seeking the same ticks by keyboard and pointer, preserving the loaded scene after an invalid import, correctly displaying tick zero, and reporting no external requests in the offline demo. Verify in Chrome with an original captured trace.

### B2-06 Reference runner and integration

Generate versioned native traces for the agreed subset and add the comparison command, held-out fixtures, and a clean-machine run guide. Acceptance requires reporting measured comparison error and event differences for every fixture, naming the first divergence on a deliberately changed trace, and completing both CLI and browser checks offline. Verify the native artifact provenance and compare against independently generated traces rather than deriving expected output from the TypeScript engine.

## Risks and decisions

- Solver order, floating-point precision, restitution thresholds, speculative contact, and reference sampling can create real differences. Freeze the observable semantics and reference build before tuning. A divergent fixture is a finding to retain and diagnose.
- Continuous collision detection is intentionally restricted. Keep unsupported shapes and motion combinations out of the feature matrix.
- Confirm the offline desktop can run the pinned TypeScript toolchain and stage the licensed native reference build or trace bundle before implementation. Use original low-complexity fixtures so the project does not depend on external game assets.
