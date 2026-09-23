# Fright House — eight-hour refinement

Window: 2026-09-23 21:25 UTC to 2026-09-24 05:25 UTC (23:25 to 07:25 Vienna). Work on `codex/visual-direction`, local review only. Hourly heartbeat id: `fright-house-eight-hour-refinement` (8 scheduled runs). Do not edit past the window; complete the report instead.

## User direction

Increase suspense (the user wrote “suspensions”), asset complexity and gameplay depth. Remove the floor skeleton. No two tables, lights or wall panels should be identical. Compare iterations, not merely accumulate detail. More references are optional and do not block work. Preserve the user's existing art direction and test checkpoints.

## Baseline V00

Commit `7b974913ae34`: playable maze followed by 420 m foggy cart escape, red moon, three floating faces, teddy with tracking eyes, fish-bag stall/flies, balloons, two cobwebs, louder laughter and smoke-obscured eight-armed monster. Complete maze/touch and cart keyboard/touch passes; mobile gate 7.5 s, 2.7 MB, 220 calls, 319,448 triangles (startup route; emulated phone on Apple M5 Max).

Baseline defects: identical evidence tables, repeated cone lamps, repeated wall treatment, obvious prop skeleton, anticipation relies largely on the phone-triggered chase.

## Comparison method

Use `tests/capture-iteration.mjs` with `ITERATION=v00` / `v01` etc. Captures fixed views at 1280×900: canopy, clown corridor, fish stall, teddy, three evidence tables and maintenance. Store at `validation/iterations/<version>/`. Keep geometry/collision, load, draw/triangle peaks and controls in view when judging. Compare directly with V00 and the previous accepted pass. Log regressions and discarded ideas.

## Approved passes

1. Controls/cleanup: remove skeleton and preview entry; keep arrows as camera turning and prove correct directions at four orientations; correct cart steering; louder/deeper grunts alongside laughter.
2. Unique scenery: lost-property desk, wheeled metal display, carnival cabinet, maintenance workbench; five individually varied fixture families; unique paint placement/damage/repair per wall panel and visual contact sheets.
3. Suspense: progress-triggered creaks, distant movement, slow light fades and brief glimpses after clues. Animate fixtures/fabric/props. Quiet intervals, no dialogue interruptions, pause/retry-safe state.
4. Maze depth: localized sprint/gate sounds lead the monster to investigate. Sight restores pursuit; losing sight searches last known location. Respect wall graph/collision.
5. Creature refinement: irregular limbs, grasping claws, partial smoke reveals, breathing and grunts that strengthen with distance and muffle through walls. Fair capture range.
6. Six road hazards: wrecked carts, collapsed stalls, tangled beams, swinging signs, rolling barrels, stalled ride machinery. Timed hazards share animation/collision positions, warn in advance, leave achievable routes. Existing steer/brake/boost controls only.
7. Four carnival landmark areas: ticket entrance, midway stalls, carousel yard, loading district. Animated gondolas/signs/shutters/carousel, distant windows, intermittent marquees and slow searchlight. Keep fog/red moon and readable obstacles.
8. Consolidate: full maze-to-cart keyboard/touch, pause/retry/AI/hazard tests, mobile gate (<20 s, <10 MB, <900 calls, <1.5M tris), comparison and recommendation. Remove weak additions. No publishing or paid tools.

Decisions confirmed by user: arrows TURN the camera, A/D strafe; combine slow dread with frequent danger in later stages; road depth uses steer/brake/boost without jump/duck. User explicitly approved this full plan on September 23. Existing eight-hour window remains unchanged.

## Progress

V00 captured under `validation/iterations/v00/`. V01 completed: floor skeleton and preview entry removed, cart lateral basis corrected, procedural positional grunts added with reset/end cleanup. No arrow-sign flip without screen-space evidence: the original maze yaw formula appears correct; the cart lateral basis was genuinely reversed.

## Practical workflow

Use escalated CLI calls per user instructions; use gh for GitHub. No publishing/pushing, new paid generation, GPU rental or user messages to others. Node: `/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`. Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Playwright module: `/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`. Local server: port 8089, `PORT=8089 node serve.mjs`. Build: `node build.mjs`; ship check: `node /Users/poli/Projects/404-game-recipe/harness/ship.mjs dist`. Existing untracked `validation/art/mobile-final*` predates this work; leave it alone.

### V01 comparison

Retained: maze arrow keys turn the camera; real-input projection checks passed at four orientations, and A/D still strafe. The maze yaw sign was already correct and was not blindly inverted. Fixed: the cart lateral basis moved opposite to screen-right; shared `trackPoint` now defines camera-relative sides. Added deep irregular grunts with proximity gain and wall muffling. Removed the floor skeleton. Baseline captures and V01 views are in the comparison gallery, with no asset-detail increase yet. Nine model tests and the four-orientation/cart direction check passed. Next pass: distinct maze scenery.
