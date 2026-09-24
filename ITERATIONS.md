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

## V10 — approved top-down street (Level 1)

User selected the detailed top-down 2D direction and requested a concept review before every level. The Level 1 facade/street concept was explicitly approved, with animated bulbs, a turning Ferris wheel and a bench newspaper.

Changed: the /two-d/ entry now starts at the approved street. The previous ticket-hall mini-game remains at /two-d/ticket-hall.html. Added independently animated Ferris wheel spokes with upright gondolas, slow coloured-light modulation, drifting fog, a collected newspaper clipping, notices/ticket/stall inspections, field notes, optional local resume, and turnstile completion. Added shared 20-area campaign metadata and checkpoint/progression foundations using the original 22-node maze.

Improved: approved artwork now supports actual exploration; the clipping tells part of the children’s story; environmental motion uses a shared pause-aware clock. Street geometry restricts movement to pavement and the entrance. Click/tap routing and keyboard/touch controls are supported.

Limits/regressions: only Level 1 is campaign-ready; the old ticket-hall remains a separate study, and the remaining areas require concept review. Character art remains temporary, not approved production sprites. The independent Ferris wheel is code-drawn to animate over an imagegen clean plate. The larger source images are retained for art review; only the street plate is loaded during play. No deployment or publishing occurred.

Retained: existing 3D and isometric versions, all earlier approved references and original game models. Production clown sprites await user appearance approval.

Validation: 38 model tests passed, including nine campaign/street tests. Desktop keyboard/mouse and emulated-touch playthroughs reached the entrance after all four discoveries; pause froze animation/audio; saved progress resumed; restart cleared state; no browser errors or missing resources. Matching frames and local load measurements are in validation/street. Physical mobile performance and full-campaign budgets are not yet validated.

## V11 — Level 1 real 3D inspections and turnstile

Changed: added an independently rendered procedural wind-up carousel on the bench and a procedural broken turnstile. The toy opens in a real 3D viewer with full rotation, mouse/touch drag, zoom, winding animation, a hinged compartment and a persistent fifth clue. Added detailed image close-ups for the noticeboard/ticket and a readable newspaper view. Gate rendering and collision use the same opening progress.

Improved: inspection reveals other sides and working mechanisms instead of just tilting an image. Separate moving parts give the street its first interactive 3D props. Fixed lost clicks after modal closure and ambiguous nearby-object routing. Cached prop renders reduce ongoing street GPU work.

Retained: V10 approved street artwork, top-down movement, animated lights/Ferris wheel, newspaper collection, previous four notes, pause/save/restart and separate older game versions. The Level 3 concept is approved and saved, but implementation remains pending.

Tradeoffs: this pass adds a Three.js dependency to the street and a stylized toy close-up; most scenery is still illustrated. No claim that every level or every prop has been converted. Desktop and touch comparison screenshots are in `validation/props3d`, with the V10 baseline in `validation/street`.

Validation: all 38 model tests pass. Desktop and emulated-touch complete playthroughs verify toy rotation/zoom/winding/opening, saved clue, frozen world position/time during inspection, all existing object interactions, turnstile completion and restart, with no page errors. New assets contain 692 (turnstile) and 4,460 (toy) rendered triangles in the integration checks. The recommendation is to retain this hybrid Level 1 candidate; it adds tangible interaction without replacing the approved street composition. No publishing occurred.

The official 404 `harness/verify.mjs` also passes both new modules (2/2 clean); its five-view contact sheet and measured bounds are retained beside the modules under `_verify`.

## V12 — textured foreground depth, ticket, ravens and hall transition

Changed: moved the carousel away from the newspaper; replaced image-ticket inspection with a thin 3D ticket carrying geometry-built print, a bent perforated stub and flip/zoom/drag controls. Added separate textured relief solids for the foreground street props, preserving the approved image at the fixed camera. The kiosk shutter now lifts and jams; three 3D ravens fly off in response to proximity.

Entering the clown mouth now closes articulated jaws behind the character and transitions into the playable L-shaped ticket hall. Street clues persist. The hall has ledger, lamp, drawer and locked-door interactions and a route to the upper attraction boundary. The prior study is retained; Level 3 is still pending implementation.

Improved: newspaper selection is unambiguous, the ticket can be examined from both sides, the street reacts to approach and the entrance now advances the campaign. Retained: original painted detail/composition, existing street props, top-down control and checkpoints. Tradeoffs: fixed-camera relief depth is not a complete freely explorable 3D park; distant scenery remains painted. No deployment occurred.

Validation: 42 model checks and desktop/emulated-touch runs through both implemented areas, with screenshots and browser-error checks in `validation/hybrid-street`.

Final asset gate: all five standalone procedural modules pass the official 404 verifier (ticket, turnstile, jaws, raven and carousel). The first ticket verification page timed out while loading; a fresh full run completed 5/5 clean. The in-game front/back ticket views were visually checked. The kiosk interior uses dim 3D shelves, hooks and ticket stock instead of a flat empty opening. Hall resume/restart also pass, retaining street clues.

## V13 — continuous mouth closure

The upper and lower jaws now move together along one smooth closing curve, with both tooth rows meeting at the same seam. Continuous opaque backing fills the doorway behind the teeth; the lower jaw no longer leaves exposed background beneath it. A straight-on mouth camera removes oblique gaps, the actor disappears inside before the seal, and the scene fades only after closure. Independent per-object render-cache keys prevent the turnstile and mouth from sharing stale progress.

Validation: the geometry test samples the motion to verify a monotonically shrinking gap and exactly meeting tooth edges. Browser captures at four points show continuous closure, verify pause freezes it, and confirm arrival in Level 2 without browser errors. Evidence: `validation/mouth-closure`.

## V14 — playable four-floor platformer trial

Changed: built the explicitly approved Level 3 concept into `/two-d/level-3.html`. The background keeps its four-floor pixel painting; a sibling clean plate removes the formerly painted barrel and machinery. Separate procedural Three.js barrels, crates, moving platforms and presses now have shared rendering/collision positions. Added jump buffering, solid obstacles, stair transitions, three collectible brass fuses, a power switch, warning phases, damage recovery, per-floor checkpoints and a final shadow pursuit with a recharging camera flash. Level 2 stairs lead here after the ledger and drawer discoveries.

Improved over V13: Level 3 is now playable instead of ending at a concept-art boundary. Players jump over solid objects, time moving hazards and escape via the top-left exit. Keyboard and touch controls are explicit; test landing selectors allow immediate review of each floor. Pausing freezes physics, hazards, stairs and cooldowns; retry restores a safe landing.

Retained: the approved composition, original concept, previous street/hall content and original 3D game. The investigator remains the temporary actor; the chase uses a temporary shadow pending character approval. This is a side-view 2.5D trial, not a full conversion of every painted prop into a 3D model. Level 2's requested reactive rat/teddy refinements remain separate pending work after the user's switch to trying this platformer.

Tradeoffs: the full building view makes the actor small on phones. Background counter and wall dressing remain scenery outside the traversal lane. The three moving platforms are deliberately narrow and higher contrast for collision readability. The trial ends at the upper exit; later campaign areas are not yet implemented. Recommend retaining this as a playable candidate for user feedback before expanding the campaign.

Validation: 50 model tests pass, including a complete simulated route and checks for solid gates/crates, stair prerequisites, pause, hazard collision and retry. Desktop and touch-emulated browser checks exercise movement, short jump taps, collision, switch/fuse collection, stairs, all floor checkpoints, pause, flash and reload with no browser errors. Official 404 asset verification passes 6/6 modules; the new obstacle set totals 1,468 triangles / 47 meshes. Evidence and actual browser route results are under `validation/platform/`. No publishing or physical-phone validation.

The real browser keyboard playthrough visited all four floors and escaped in 28.6 seconds with no retries (one hazard hit, health replenished at a landing), with no page errors. The existing full street/hall regression also passed on desktop and touch emulation and verified the new Level 3 navigation. Concept/candidate comparison: `validation/platform/comparison.html`.

## V15 — walkable stairs, wall riddle and mirror spiders

Changed: replaced the E-triggered stair tween with authored flights/landings driven by movement. Up/down (or W/S and touch buttons) climb or descend; releasing stops immediately and direction can be reversed. Walking into the stair base also begins ascent; jumping onto a flight lands on its treads. Repeated visits to an old landing do not refill health.

The wall-mounted mains panel now opens a close-up riddle. A correct answer releases its interlock; power remains off until the user pulls the separate real 3D red lever. The lever moves continuously over 1.1 seconds. Wrong answers keep it locked. The world freezes during inspection, pause freezes the lever, and closing early cancels an unfinished pull.

Removed the swinging obstruction in front of the mirrors. Three original procedural spiders emerge from floor/wall gaps on approach, briefly telegraph a locked landing target, leap in an arc, scuttle and retreat. Their articulated legs animate. The same hazard positions drive visible geometry and damage; moving away or jumping can avoid them. The moving floor farther right, barrel floor, fuses and final chase are retained.

Improved over V14: the staircase is controllable architecture rather than a scene transition, restoring power involves a short puzzle and a physical control, and the mirror gallery reacts to proximity with an avoidable threat. Tradeoffs: arrow-up/W now climb rather than jump; Space remains jump. Art and stairs are still a fixed-camera 2.5D interpretation of the approved painting. Earlier character placeholders remain unchanged.

Validation: 53 model tests pass. Real desktop and emulated-touch checks cover wrong/correct answers, pulling the 3D lever, frozen world time, stop/reverse stairs, spider warning/leap/reset and absence of the former pendulum. A full keyboard escape visited all four floors in 30.8 seconds without damage or retries. No browser errors. Official 404 verification: 8/8 clean, including the 720-triangle spider and 200-triangle lever. The lever’s rear is explicitly declared a flush wall mount; its footprint is centered. V14 screenshots remain intact; V15 evidence and comparison live in `validation/platform-v15/`. Recommend V15 over V14 for user playtesting. No publication or physical-device claims.

## V16 — the toy-room blackout and reactive ticket hall

Changed: implemented the explicitly approved Level 4 concept and revised wind-up → blackout → living toys → escape sequence. The real 3D rabbit takes three key turns. Lights fade, briefly black out, and 24 separate toys hop down and pursue around the solid cage/furniture. Six toy families vary silhouette, damage, proportions and colour. The red bolt releases after 7.5 seconds; opening and physically crossing the doorway completes the chapter. The optional drawing adds a journal warning. Level 3 now leads here. The previous proposed key/dial puzzle is superseded by the user's revised sequence.

Level 2's stationary painted teddy, rat and balloons are replaced by original procedural props. Proximity pops both balloons with brief fragments/sound, sends the rat down a clear escape route away from the player, and animates the teddy's head and arms. Reactions freeze on pause/dialog and reset on restart. Its teddy footprint is solid; hall interactions remain reachable.

Improved: another coherent playable chapter, live 3D inspection, purposeful light failure and pursuit, and a reactive earlier room. Tests caught and fixed a tap-route snag at cage corners, an open-door tap that still selected its old interaction point, and an exit prompt wrongly hidden by the slammed entry door. Chase tuning adds a short recovery window and post-hop grace period so dense groups cannot remove all health immediately.

Retained: approved painted layouts and colours, separate collision/foreground layers, campaign notes, Level 3 platformer, keyboard/touch controls and test checkpoints. Tradeoffs: procedural prizes are simpler than the detailed concept painting; furniture remains fixed-camera textured relief. Darkness intentionally limits visibility to the flashlight and exit. The investigator is still the existing placeholder. This ends at the red exit; later planned chapters are not implemented. Recommend V16 as the next local playtest candidate.

Validation: 60 model tests pass. Full desktop mouse and emulated-touch entry/inspection/escape runs both finish with all 24 toys awake and no browser errors; pause/retry restore state. The separate keyboard escape completes in 11.1 simulated seconds with two health remaining. A full four-floor keyboard Level 3 run also reaches the new Level 4 link without retries or browser errors. Hall reactions/reset pass desktop and touch. The 404 verifier is 13/13 clean. Level 4 measured 3.49 MB resource transfer, 592 dynamic-prop draw calls and 31,312 triangles across its two depth passes; static relief is cached once. Local headless load-to-start was 0.34 s desktop / 0.16 s touch emulation, not a throttled-network or physical-phone measurement.

Evidence: `validation/toystore-v16/comparison.html`, matching concept/candidate views, a recorded keyboard escape, results JSON and Level 3 arrival captures; `validation/hall-v16` has before/after and reaction tests. No deployment or paid service use.

## V17 — solid storeroom crates

Replaced the central cage's thin bar overlays and the corner stack's sparse strips with extruded Three.js volumes, preserving their painted finish through projected textures. The central crate now uses an angled floor polygon; each wooden crate has its own solid footprint. The same definitions build the meshes and drive player/toy navigation. Complete foreground coverage hides the investigator correctly when walking behind the crate. One toy landing was moved clear of a newly solid box.

Validation: 61 model tests pass, including movement into crates from four sides, routes around them and the full toy-room escape. Desktop keyboard and emulated-touch checks verify that the cage and corner crates stop movement, with no browser errors. Screenshots and results: `validation/toystore-crates`. Retained the approved room artwork and clear escape corridors; this remains fixed-camera textured 3D relief.

## V18 — flying corridor insects

Level 2 now has sixteen procedural 3D flies with independent hovering paths, height changes and moving wing pivots. Nearby flies scatter away from the investigator while staying inside the hall/corridor. Existing 3D teddy, rat and balloon behavior remains intact. Time-based motion freezes during pause and dialogue and resets on restart. Desktop and emulated-touch reaction tests pass without errors; motion recording and before/after captures are in `validation/hall-v18`.

The official asset verifier reports the fly's intended insect-scale width (0.036 m) as below its generic prop-size threshold; visual review confirms this is a deliberately tiny insect, not a unit conversion error. The other thirteen modules are clean. The fly is original Three.js constructor geometry with no external mesh data.


## V19 — selectable levels, deeper props and new threats

Changed: added `two-d/test.html`, a responsive level-select page for all four updated levels, three platformer floor shortcuts and a toy-room start beside the rabbit. Every level links back to it. Added solid projected volumes to the street bench/kiosk/cart, hall counter/cabinet/door and toy-room furniture. The approved red-haired clown fires telegraphed arrows upward; bomb balloons give a 1.6-second warning. Arrow collision follows the swept flight path. Pause and retry freeze/reset encounter state.

Fourteen larger toys fill the open central crate, with twenty-four awakening overall. Their heads and luminous pupils follow the player during blackout. The crate retains solid collision and separate foreground faces. The approved revised investigator has front/back/side sprites across the four levels.

Improved: direct access for repeated playtesting, clearer physical depth, new platformer timing choices and a more threatening toy-room reveal. Retained: approved layouts, controls, inspections, checkpoints and routes. Limitations: scenery remains fixed-camera textured relief; the investigator uses four directional images with walking bob, not a full drawn walk cycle. Increased prop detail adds render cost; the toy-room escape remains achievable but finishes with one health in the tested route. Earlier V16–V18 evidence remains intact. Recommend V19 for local user testing.

Validation: 65 model tests pass. Full keyboard platformer escape completes in 31.135 seconds without hits or retries. Desktop and emulated-touch street/hall and toy-room regressions pass with no browser errors. Toy room: 24 awake, 634 dynamic-prop draw calls, 34,672 triangles, 4.54 MB resource transfer; local start measured 392 ms desktop / 199 ms touch emulation. These are not physical-phone or throttled-network measurements. All nine hub links, five play links, three floor shortcuts and 390px mobile layout pass. Official geometry verifier: 16/17 clean; the remaining warning is the previously documented intentionally insect-sized fly. Evidence: `validation/three-d-v19/` and `validation/platform-v19/`. Local only.

## V20 — animated characters, physical props and a faster carousel blast

Changed: the larger investigator has sixteen authored walking frames and eight jump frames. The larger red-haired clown now walks, climbs stairs, aims and shoots with separate sprites, emerging from a hinged door aligned with the rear wall. Upper-floor gears, belts and pistons operate behind the wall openings. Level 2's lost-property drawer is a visible, opening 3D cupboard. Level 1 has an aligned 3D turnstile, a cleaned background, a closed-gate collision boundary in front of the player, blinking bulbs, raven calls/wingbeats and a newspaper that remains on the bench. Level 4 adds a hinged bin, blinking eyes, a climbing/running rat, flying insects and improved doorway animation and depth ordering.

The connected red/yellow/blue tin carousel plays a music-box tune and bursts into fire, smoke, sparks and physical fragments. The requested tin finish replaces the briefly tested glossy version; the hidden clue is removed. The latest explosion expands from eight frames at 6.25 fps to twenty-four at 30 fps: 0.8 seconds for the authored blast, with procedural smoke clearing by 1.7 seconds. This preserves the requested radial orange-fire/grey-smoke appearance while making its motion sharper.

Improved versus V19: genuine pose changes replace walking bob; drawer and gates are easier to understand; hazards originate from the moving clown; reactive props and more deliberate depth ordering improve the rooms. Retained: approved layouts, top-down presentation, platformer controls, checkpoints, inspection rotation and the original tin palette. Tradeoffs: more sprite assets increase transfer size, and the moving clown makes the tested platform route harder (two hits versus V19's zero). Scenery remains fixed-camera textured relief, not a freely navigable 3D world. Recommend V20 for local playtesting.

Validation: 76 model tests pass. Full keyboard platformer escape: 31.648 seconds, no retries, two health remaining. Desktop and emulated-touch street/hall and toy-room runs pass; pause/retry and inspections remain functional. No browser errors in these runs. Toy-room transfer: 7.51 MB; 750 draw calls / 40,712 triangles, rising to 762 / 41,932 during the rat reaction. Local startup was 449 ms desktop and 246 ms touch emulation; this is not a physical-phone or throttled-network measurement. Official constructor-geometry checks: 20/21 clean; only the previously documented 0.036 m fly is below the generic size threshold. Captures, route results and animation preview are in `validation/walking-v20/`.

Level 5: the specimen-library concept is saved at `two-d/art-review/level-5.html`, awaiting appearance approval. Planned sequence: ringing desk phone → children's voices → broken specimen jar → human-faced worm chase. It is not yet playable.

## V21 — the long specimen-library chase and crate collision correction

Changed: built Level 5 after concept approval, then expanded it following the user's playtest feedback. A 1,680-pixel world spans 3.5 screens; the camera follows through a long library with alternating shelf obstacles. The red exit is at the far end. Its lock takes 2.4 seconds to release, followed by the door's opening motion. The investigator is 68 pixels tall here (70% larger than the previous 40), with a larger floor radius. Solid entry jambs and a raised foreground lintel match a walkable doorway rather than an unrestricted painted passage.

The retained carpet and architecture receive a procedural twin-pedestal desk, warm green banker lamp, rotary phone, sixteen specimen cabinets and 97 jars. Mild lighting variation follows simulation time. The phone rings on entry; its receiver lifts in real 3D, and two local synthesized childlike voices say “You can’t escape.” Approaching specimen 087 after the call tips and breaks a jar. A detailed human-faced worm emerges, crawls around furniture, telegraphs a bile shot toward the player's previous position, then recovers before chasing again. Furniture blocks the projectiles, which leave brief avoidable puddles. The creature speeds up when it falls behind without teleporting. A phone-completed checkpoint and a fresh restart are available.

Improved: another coherent chapter, sustained scrolling pursuit, physical cover, separate props, better character proportions and a delayed final exit. Retained: approved office composition, carpet, green lamp, keyboard/touch movement and real 3D inspection. Tradeoffs: procedural cabinets have simpler detail than the painting; opposite vertical creature travel reuses the frontal sprite row. The twenty-four worm frames contain six crawling and six spitting poses in side and frontal views. The voice performance is synthesized locally, not recorded by child actors. Further chapters still require concept approval.

Level 4 correction: expanded crate collision to include the full base/wheel clearance and rear corner strips; moved one toy landing outside the enlarged solid. Desktop and touch collision checks and complete toy-room escapes pass. Earlier angled mesh artwork is retained. Recommend V21 over V20 for local playtesting, retaining the crate fix.

Validation: 85 model tests pass. Full desktop and touch Level 5 runs complete the phone, jar, long chase, delayed latch and escape without browser errors. Both finish with two health; touch encounters seven bile shots. The separate keyboard chase finishes with two health and five shots, recorded in `validation/library-v21/keyboard-chase.webm`. Pause (including during the phone call), inspections, retry and restart pass. The jar reveal preserves held keyboard input. Resource transfer is approximately 8.2 MB; peak measured rendering is 386 draw calls / 96,804 triangles. Local startup is under one second, not a physical-phone or throttled-network benchmark. Constructor geometry verification is 23/24 clean; only the longstanding intentionally tiny fly warns. Comparison, motion, results and exact image prompts are in `validation/library-v21/`. Local only.

### V22 — Connected rotary phone, entrance threshold and shelf ambushes

- Changed: rebuilt the phone as a rounded red molded shell with a sloping rotary dial, joined cradle and curved handset. A deforming coiled cord is attached to body and handset sockets across the entire lift; lowering resumes after putting it down. Geometry is generated with Three.js operations.
- Fixed: the entrance's vertical painted opening was incorrectly accepted as floor. Replaced that rectangle with a diagonal threshold at the base, corrected both solid jamb footprints and foreground depths. A direct upward approach now stops below the wall; the opening remains reachable with keys and click/touch paths.
- Added: four shelf specimens. Each jar rattles for one second, falls, breaks and reveals an animated worm, then fires up to two warned, fixed-aim bile shots. Projectiles share solid-wall/furniture collisions. Encounter state freezes on pause and resets on retry.
- Improved: phone construction and attachment read clearly; player feet no longer climb the doorway artwork; additional shelf attacks increase pressure throughout the scrolling chase.
- Tradeoff: the harder route is less forgiving (desktop/touch test escape with one health remaining). Phone remains stylized to match the low-resolution game rather than photorealistic.
- Retained: approved library artwork, room scale, long scrolling layout, existing main pursuer and far-end timed exit, controls and checkpoints.
- Evidence: `validation/library-v22/index.html`, endpoint attachment regression, entrance traversal regression, shelf attack timing/pause/reset regression and browser playthrough results. All 88 model tests pass. Keyboard escape also passes (one health, nine shots, all four ambushes fire); desktop/touch passes include all four attackers (14 shots). The generated phone passes the 404 asset verifier: 8,676 triangles, grounded and centered, four modeled sides.

### V23 — Walk behind the library shelves

- Changed: replaced all four freestanding aisle shelves' full-height collision rectangles with 18-pixel floor footprints. Their placement and width now come from one shared rendering/collision layout. Corrected the upper side shelf and entrance cabinet to use their bases too.
- Improved: you can cross behind each cabinet by keyboard or click/touch, while the shelving naturally occludes the character. Front approaches still stop at the solid base. Creatures and bile use the same floor obstacles.
- Retained: shelf models, positions, story, four jar ambushes, chasing worm and delayed exit. Wall-backed shelving remains against the wall.
- Tradeoff: rear aisles provide more escape choices and shorten some chase routes; this removes unintended invisible barriers. No added geometry or assets.
- Validation: 89 model tests pass, including direct rear traversal and solid-base checks for every aisle shelf. Browser evidence and recordings: `validation/library-v23/`.

### V24 — Level 3 room perspective and character proportions

- Changed: moved the playable floor planes inward from the cutaway's front lip: 18 pixels on the entrance floor, 14 on the railed floor, 5 in the shallow mirror room and 7 on the top floor. Shared layout constants keep stair endpoints, floor props, moving platforms, barrels, spiders, arrows and balloon hazards aligned.
- Improved: the investigator renders at 80 pixels rather than 58 (38% larger), closer to the doors/counter's scale. The clown is 100 pixels tall and remains larger than the investigator, including walking, shooting and stair frames. The emerging clown reaches the revised entrance floor without a vertical jump.
- Retained: artwork, inspections, controls, jumping physics, hazard timings and four-floor sequence. No added assets or rendering passes.
- Validation: all 89 model tests pass. Full keyboard playthrough reaches all four floors and Level 4 without retries (two health remaining), with no browser errors. Screenshots and control checks are in `validation/platform-v24/`.

### V25 — Paint-drum review, storeroom scale and reactive ambience

- Level 6 remains in concept review. Added a rotatable live Three.js preview of a connected roller launcher and red/blue ribbed steel paint drums. A warning precedes launch; impact releases the lid, throws paint droplets and leaves floor/target splashes. Pause, reset and color selection are available. Both procedural asset modules pass the 404 geometry verifier (2/2 clean). This is an asset prototype, not the playable Level 6.
- Level 4 investigator now uses Level 5's 68-pixel height and a six-pixel navigation footprint. The entrance has separate extruded jamb/lintel layers, a restricted floor threshold and foreground wall occlusion during crossing, so the actor no longer renders over the header. Closed-door blocking and travel in both directions are checked.
- Level 1 has scattered pavement confetti which lifts, tumbles and settles when approached by a moving actor. It respects walkable ground, pause and reduced-motion preferences. Level 2's painted clown pupils are animated opposing spirals; the ticket ledger no longer contains the final pencil-arrow sentence.
- Validation: 94 model tests pass; production build passes. Desktop and touch Level 4 complete the toy chase with all 24 toys active. Additional browser checks cover both-way doorway traversal, confetti movement/pause, spiral-eye renders, blue paint impact and reset, with no browser errors. Evidence: `validation/store-v25/`, `validation/paint-barrels-v25/`, `validation/ambience-v25/`.
