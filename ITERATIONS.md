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

### V02 comparison — accepted

Changed: replaced the three identical evidence tables with a reception desk (turned legs/drawers), castor trolley (wire shelf/handle), and carnival cabinet (scallops/doors/repair brace). Maintenance gets a bolted shelf, drawers and vise. Built five fixture families with 25 individual proportions, drops and wear tones. All 29 wall panels have unique spiral placement, seeded paint wear and repair construction. Individual specifications and actual rendered contact sheet: `validation/iterations/v02/`.

Improved against V00/V01: furniture silhouettes communicate different former uses; wall repairs provide landmarks. Retained: footprint, evidence height, all user-selected hero props and interactions. Regression: more materials increase the emulated startup route from V00's 220 calls to 264; still comfortably below 900. Some fixtures remain subtle in darkness, deliberately preserving lighting contrast. No new bitmap downloads.

Checks: all eight matched camera views render with zero errors (largest review view 452 calls / 404,053 triangles). Visually inspected the four furniture views and full 29-wall/25-lamp contact sheet. Distinct design audit passes. Real-touch jam release and maze-to-cart transition pass. Throttled mobile gate: 7.5 s, 2.7 MB, 264 calls, 287,190 triangles, 0 missing assets/errors; emulation on Apple M5 Max, not a physical phone. Next: milestone suspense and animation.

### V03 comparison — accepted

Changed: each new clue schedules one of three suspense motifs. A creak precedes distant movement or a slow dip to 76% of the local lighting; quiet interval is 14 seconds. Reading and narration hold events. Five fixtures sway with the event; canopy cloth undulates subtly. Distant shapes are scenery only, without an extra face or unfair collision. Read-only telemetry exposes queue, active event and age.

Improved against V02/V00: exploration has an escalating response to progress, while the quiet layout-learning stage remains. Retained the darker corners and normal clue UI. Regression/tradeoff: five moving fixtures cannot be statically batched, adding eight calls in the widest matched view (460 vs 452). Glimpses can be hidden by geometry; no through-wall overlay forces a scare. No new audio download: original procedural creaks use the existing sound engine.

Checks: pure event schedule test passes (deduplication, pause, narration, quiet gap, reset). Real browser clue pickup proves reading holds event, pause freezes all effects, resume continues, and new investigation resets queue/seen state. Six captured motion frames and telemetry: `validation/iterations/v03/`. Eight matched cameras: zero browser errors; maximum 460 calls / 403,936 triangles. Next: sound investigation and fair search.

### V04 comparison — accepted after correction

Changed: monster sight overrides hearing; losing sight preserves last-seen coordinates instead of reading the player's hidden position. Sprinting can be heard over 11 m of connected corridors, wall mechanisms over 22 m. Reaching a target produces a bounded nearby search, then listening. Phone activation provides the initial target. Read-only investigation telemetry exposes mode, source, destination and last sighting. Capture still requires proximity and unobstructed sight; the maintenance shutter now also blocks sight.

Improved: walls support quiet escape and misdirection rather than merely making an omniscient pursuer take a detour. Retained: controls, wall graph and physical collision; route checkpoints remain unchanged. Regression found in the first test: switching between sight/hearing at the 12 m visibility limit restarted the next waypoint, causing backtracking. Fixed by invalidating the route only when its goal cell changes, not its sensory label.

Checks: three pure perception/hearing/search tests pass. Real-touch maze-to-cart passes. Browser investigation test traces every crossed cell and proves each is an open adjacent passage; creature reaches/captures a stationary visible player, audio stops, pause freezes investigation, and retry resets memory to the phone target. Six approach frames and navigation trace saved. Eight matched scenery views remain identical to V03 within animation timing (460 calls max), with zero errors. Next: creature motion and proximity audio.

### V05 comparison — accepted

Changed: staggered arm frequencies, irregular recoil, grasping fingers, slight breathing deformation, and a 1.3-second unfolding reveal from smoke. The core remains difficult to identify. Added filtered breath and continuously updated proximity/panning/wall muffling to grunts. Reset and ending stop all creature voices.

Improved against V04/V00: hands no longer move with one synchronized rhythm; near audio provides a stronger warning. Retained eight arms, the black smoke, laughter and the same collision/capture range. Tradeoff: subtle reveal and breath are best judged in motion with sound; static maze views intentionally remain unchanged. No additional geometry cost or transferred audio assets.

Checks: eight creature motion frames saved, all eight matched scenery views free of errors. Audio browser test measures a lower gain and low-pass frequency behind walls while a grunt is already playing; breath exists and reset removes both sources. Peak matched view remains 460 calls. Investigation/capture regression continues in consolidation. Next: six road hazard families.

### V06 comparison — accepted with final retry retest queued

Changed: six obstacle families replace three repeated props. Wrecks have wheels/seats/side rails, stalls have collapsed striped awnings, beams have twisted wire, signs lift and swing, barrels roll, and machinery rocks. Advance reflectors sit 12 m ahead. Renderers and continuous collision use the same `hazardState` positions/time/height. Read-only ride telemetry reports moving hazard bounds and age.

Improved: warning distance and distinct silhouettes make decisions readable; raised signs create a timing opportunity, while every row always keeps an alternate safe track. Steering/braking/boosting remain the only maneuver controls. Retained fog, red moon and all checkpoints. Regression found: the first moving envelope left only a 10 cm safe margin and the keyboard driver clipped a hazard once. Reduced movement excursion and used geometry-specific widths; the corrected keyboard run escaped with zero hits. Touch also escaped with zero hits (prior wider envelope).

Checks: eight pure driving/collision tests pass, including every family across 20 s of animation phases, raised-sign clearance, collision recovery and no repeated damage. Full keyboard escape: 257 peak calls / 65,676 triangles, zero hits. Full touch escape: 255 calls / 64,036 triangles, zero hits. Pause freezes moving hazard snapshots/audio. Keyboard capture/retry follow-up hit its wall-clock timeout while the background browser advanced only 3 simulated seconds; retest uses a longer timeout, not altered gameplay time. Ten fixed road views and eight sign motion frames are captured, with matching V00 road views from an isolated snapshot. Next: carnival districts, then all final tests.

### V07 comparison — accepted

Changed: replaced the repeated park booth strip with 13 individually named structures across ticket entrance, midway, carousel yard and loading district. Added an octagonal kiosk, admission office, four distinct stalls, arched arcade, carousel animals/roof gaps, wheel gondolas, corrugated shed/crates, gantry hook and a searchlight tower. Signs, shutters, carousel, gondolas and partial marquees animate on ride simulation time. Windows and restrained practical lights create depth. Read-only park telemetry records district specifications and animation age.

Improved against V06/V00: four recognizable silhouettes break up the route; the carousel and loading shed are landmarks rather than identical boxes. Retained fog, red moon and open hazard sightlines. Corrected the first lighting pass, which left building fronts too dark, by putting practical lights in front of the relevant facades. Regression/tradeoff: 72 live pieces (mostly tiny marquee bulbs) raise road peak calls to 464, still below 900; further batching is a consolidation opportunity.

Checks: ten road stills and eight motion frames render without errors. Fixed approach cameras for midway/loading are updated equally for baseline and previous accepted version. Full keyboard cart pass with zero collisions: 464 calls / 77,819 triangles. Braking capture and final checkpoint retry now pass. Earlier incomplete background runs were caused by concurrent WebGL tests; validation is now sequential. Eight maze comparison views unchanged from V06. Next: full keyboard/touch maze-to-coast tests, mobile gate, optimisation, final recommendation.

### V08 consolidation — accepted

Changed: instanced the marquee bulbs while preserving their placement and intermittent operation, reducing live park objects from 72 to 24. Cleared old phone/mechanism sounds and investigation memory at stage reset. Kept a capture guard for an already-overlapping visible creature. Failed release/exit mechanisms now produce localized investigation sounds. Added individual fixture radius/tilt/wear metadata and construction specifications. No new scenery was added during consolidation.

Improved against V07: keyboard cart peak fell from 464 calls to 415; full touch cart uses 392 calls. The four district designs and hazard behavior remain. Retained all requested hero assets and stable checkpoint/controls interfaces. Regressions: none observed in completed full runs. Test-driver corrections: touch driver initially sent TouchEnd without an active touch; fixed the harness, then repeated the entire touch route successfully. Browser tests run sequentially to avoid competing WebGL sessions.

Checks completed: 16 model tests; full keyboard and full touch maze-to-coast escape with zero cart collisions and zero browser errors. Four-orientation arrows/A-D and screen-direction cart checks pass. Throttled mobile cold-load: 7.6 s, 2.7 MB, 276 calls, 277,050 triangles, zero missing assets/errors. Throttled chase/cart checkpoint audit: 420 calls / 322,036 triangles, pause freezes visuals, investigation, park animation and audio. Full touch maze route observed 527 calls / 484,805 triangles. These are browser-emulated mobile results on Apple M5 Max, not physical-device measurements.

Timing: the planned feature window ended 2026-09-24 05:25 UTC (07:25 Vienna). A time check at 06:11 UTC showed work had run beyond that cutoff. Feature edits stopped at that check; subsequent actions are validation, saved comparisons, packaging and reporting. Do not resume feature edits on a scheduled wakeup. Finish/report the strongest existing candidate only; do not create another scheduled task.

All sequential controls/mobile/design-audit/motion captures pass. Final-candidate investigation/capture/pause/retry also passes. All four comparison modes load their images without errors. V08 is the recommended candidate for this completed refinement series. Packaging follows the saved commit.

New user direction after the refinement window: replace the square-feeling opening with an original multi-storey attraction inspired by the supplied exterior photograph. Add a broken turnstile, empty 1980s cinema ticket booth with faint light, dark flashlight corridor and light switch, rolling barrel, uneven moving floors, loud disturbance/run/fall into an irregular multi-floor illusion maze. This new request authorizes a separate implementation after saving V08; it does not extend or duplicate the old scheduled task.

### V09 — new user-directed entrance, atmosphere and pixel presentation

Changed after the completed V08 window: original colourful tower/slide/clown-mouth frontage; expanded overgrown grounds, thicker fog, neon entrance arrows, rats and coloured festoon bulbs. Added the turnstile/ticket-booth/flashlight/switch opening, rolling barrel, stairs and moving floors, door-triggered animatronic and swarm room, then the fall into a notched 22-room labyrinth. Per the latest correction, the puzzle maze is entirely flat: the raised eastern gallery proposal was removed. Added four modeled door families, specimen jars/books, a mirror-only player body, articulated clown eyes/jaw, darker smoke, and an offline whispered “Come here, darling.” The faster cart creature throws telegraphed axes; looking back and flashing stuns it, with a recharge and shared projectile render/collision state.

The user selected the Fake 2D / 2.5D comparison. Retained its coarse rendering, limited palette and illustrated edges while leaving HUD text sharp. First-person controls remain pending the explicit camera preference; `?look=smooth` is the side-by-side rendering baseline. The external style study is not shipped with the game.

Improved: opening progression and architectural landmarks, distinctive room encounters, clearer physical prop placement, varied maze walls, consistent rotating-wall floors, and an additional cart combat choice. Retained: three clues and rotating mechanisms, mirrors, floating faces, teddy, fish, balloons, the full cart route and all previous test checkpoints (plus MAZE START). Tradeoff: coarse pixels obscure some small surface detail; smooth rendering remains available for asset inspection. Reference-inspired models are still procedural/stylized, not photoreal scans. Fixed-room-camera gameplay is not implemented.

Validation: 22 pure model tests pass. Keyboard entrance and full touch entrance passed, including pause/fall and both room triggers. Keyboard maze-to-coast passed before the pixel/axe changes. Full real-touch maze-to-coast passed on the selected pixel renderer with seven axe wind-ups countered by seven flashes, zero hits and zero browser errors; maze peak 637 calls / 536,381 triangles, cart peak 393 calls / 74,853 triangles. Focused final desktop/mobile render, axe-flash, pause and smooth-fallback checks pass with zero missing resources or browser errors. Local mobile emulation at 2× CPU throttle loaded in 1.163 s with 2,801,795 resource bytes; this is a local-server emulation, not a physical-phone network benchmark. Both modes remain under the planned rendering budgets.

The final touch entrance repeat passed on the selected rendering with the corrected stair/landing geometry. All work remains local; nothing has been published.
