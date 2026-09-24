# Fright House — top-down campaign implementation

The user selected the detailed top-down pixel-art version. The isometric experiment is excluded. The existing 3D game remains the gameplay reference, and the old ticket-hall study remains at /two-d/ticket-hall.html.

## Review workflow

Every level receives concept art and user feedback BEFORE playable level production. Do not infer approval for later levels from Level 1. Character concepts require explicit appearance approval before production sprites; the current actor is reused temporary code art.

Level 1 concept v1 was approved in the user message: “yes build this level based on this image. the lights should be animated add an item on a bench a newspaper about the park. the ferris weeel in the back should be spinning”.

## Current delivery

Level 1 at /two-d/index.html is a playable street with the approved facade and forecourt; an independently rotating Ferris wheel with upright gondolas; gently animated coloured bulbs; drifting fog; a readable bench newspaper that disappears when its clipping is collected; missing-child notices; an admission-ticket inspection; a shuttered-stall sound; and a broken turnstile leading to the end of this approved level. Field notes persist locally, with an optional Continue Investigation button. Pause freezes motion and audio. Restart begins a new street investigation.

Only Level 1 is implemented as campaign content. The full 20-area campaign is not yet playable. The entrance completion screen explicitly identifies the pending next level; the old ticket-hall study is a comparison, not a completed campaign area.

## Shared foundations

The campaign manifest defines 20 areas. The state layer reuses the original 22-node maze connectivity and evidence prerequisites; stores door discovery, journal and one-time events; pauses story transitions; and snapshots checkpoints. It is framework work, not implementation of all those levels. Collision coordinates and illustrations for later areas wait for their concept reviews.

The prototype tests cover exact original maze-node coverage, gate/evidence/power/recording prerequisites, unrevealed door interiors, checkpoint state and versioned saves. Scene controllers will enforce interaction reach, mechanism sweep clearance and actual puzzle button sequences when each approved level is built.

## Accepted direction

Keep 20 distinct connected areas with story illustrations excluded from the count. Hidden rooms use separate screens. Follow the missing children’s trail, with at least three authored interactions per on-foot area. Use the original backpack, sneaker and cassette as main evidence; street discoveries are separate journal notes. Lower maze floors stay flat. Retain upper moving floors, mechanism puzzles, phone-triggered chase and top-down cart finale. The future monster is a fat human-armed clown carrying an axe, with a whispered “Come here, darling”; no spider limbs. Character concepts are still pending review.

## Art provenance

Built-in imagegen produced the approved concept and a clean background plate that removed only the static distant wheel so code can animate it. Source concept: art-review/concepts/01-street-v1.png. Game plate: assets/street-clean.png. No paid API or external stock assets were used. Existing local audio is reused. The clipping is original fictional story text.

Concept prompt:

Use case: stylized-concept. Asset type: LEVEL 1 CONCEPT ART for a real top-down 2D pixel-art horror game named FRIGHT HOUSE. The attached image is a STYLE reference only: use its richly detailed aged pixel art, chunky consistent pixels, restrained sepia/burgundy/teal colours and atmospheric carnival light. Do not reproduce that interior. Create ONE landscape 4:3 gameplay-area concept showing the exterior street approach to the funhouse, entirely 2D orthographic RPG art. No isometric diamonds, no 3D rendering, no cinematic vanishing-point ground. Floor and paving grid parallel to image edges, viewed from above; north-facing building front shown as an upright illustrated wall like a top-down RPG. No player or monster sprites yet, no HUD, no concept-sheet borders.

Layout: the upper 40 percent of the scene is a broad abandoned colourful funhouse facade: two tall red-and-dirty-cream striped towers with pointed red roofs, curved decaying red slide tubes, teal and faded yellow carnival cladding, a large grotesque painted clown-mouth entry in the centre. Above it, a broken incandescent marquee spells exactly "FRIGHT HOUSE". This is an original abandoned 1987 carnival, scary but still colourful. A dim amber light deep in the mouth, a half-broken turnstile just outside. Small neon arrows at the entry spell "ENTER" and "ENTRANCE". No floor-count signage.
The lower 60 percent is a clearly walkable top-down street and forecourt: an irregular cracked path enters at the bottom centre, widens into an open forecourt, and reaches the central entrance. Low overgrown brick walls, iron railings, leafless trees and ivy frame the edges; no obstructions across the main walking path. On the left is a lit noticeboard with three small missing-child flyers, no legible small text needed, and a tilted wooden bench. A tiny faded ticket lies on the path nearby as a discoverable object. On the right, part of a shuttered carnival stall and a decayed small ride give the grounds depth and identity. A few large red, green, yellow and blue bulbs hang on sagging wires; warm isolated light pools guide the route, contrasting with dark green-grey fog around the edges. Fog veils distant attractions and trees without hiding the foreground path. Worn stone slabs, weeds, damp stains and sparse litter have distinct hand-painted pixel clusters.
Mood: unsettling quiet before entering, readable game geography, abandoned not ruined beyond recognition. Closely match the attached approved top-down game's detailed pixel painting rather than smooth digital illustration. No characters, no axes or creature, no speech boxes or interface. The whole image is the single level, not a montage.

Clean-plate prompt:

Use case: precise-object-edit. Production clean background plate for the approved Fright House top-down level. Preserve the ENTIRE attached image exactly: same framing, pixel-art style, facade, signage, towers, trees, fog, bench, flyers, paving, stall, turnstile and lighting. Change ONLY the distant Ferris wheel in the upper-left background: remove its circular rim, spokes, gondolas and attached colored lights, replacing just those pixels with matching foggy dark sky. Keep nearby trees and building silhouettes intact. The wheel will be animated as a separate layer in the game. Do not alter anything else. No new objects, no characters, no image borders. Same dimensions and composition.

## Validation and next work

See tests/campaign.test.mjs, tests/street.test.mjs and tests/street-browser.mjs; results and screenshots are saved under validation/street. Touch checks are browser emulation, not physical-phone testing. Full-game mobile budget acceptance waits for complete-game implementation.

Next: present the Level 2 ticket-hall concept for review before adapting the old study into its campaign role. Do not silently carry its placeholder three-item/monster mini-game into the final ticket hall.

## Level 1 hybrid inspection pass — September 24

The user approved adding a real 3D turnstile and a wind-up toy while retaining the approved top-down street. Both are original Three.js geometry-as-code modules under `assets/three/`, with constructors, named moving pivots, real-world dimensions, centered footprints and ground at y=0. No mesh data, downloaded models or texture files are used in these objects.

The bench toy is an original tin carousel: drag through a full turn, zoom, use alternative rotation buttons, wind the rotating key/display, and open a hinged deck to reveal a physical brass 03 plate and a story clue. The compartment discovery is the fifth field note and persists with optional resume. The 3D turnstile replaces the former 2D line animation, uses the same opening progress as entry collision, and is composited around the player by depth. Cached street renders avoid rendering static 3D props every frame. Close-up inspection renders live geometry.

The missing-child board and ticket use generated close-up artwork, selectable poster/stamp details and a small perspective tilt; these remain image inspections, not full 3D. The newspaper is readable dirty-paper typography. Close-up artwork lives in `assets/inspection/missing-board.png` and `assets/inspection/admission-ticket.png`; generated using the built-in imagegen tool from the approved street direction. Board brief: weathered wooden noticeboard, three anonymous missing-child posters beneath an amber lamp, detailed pixel art, no personal contact information. Ticket brief: worn cream/burgundy admission ticket, FRIGHT HOUSE / ADMIT ONE / OCT 17 1987 / 087, matching pixel art.

Fixed two interaction defects: asynchronous modal cleanup could erase the next click's path, and nearest-object selection could override the explicitly clicked object when interaction ranges overlapped. Closing is now synchronous and queued interactions honor the selected reachable object.

Level 3's four-floor side-view concept (`art-review/concepts/03-platform-attraction-v1.png`) was explicitly approved, with separate obstacles and hybrid 3D barrels/platforms/gearbox proposed. It is not yet a playable campaign level. Future levels must separate scenery, collisions and moving obstacles; benches, kiosks and closed gates must block movement. This Level 1 pass does not convert all background scenery into 3D.

Validation: `tests/props3d-browser.mjs` drives real input through all five street discoveries, including the live 3D inspection, then opens the turnstile and completes the level, on desktop and emulated touch. Evidence is under `validation/props3d`. All 38 existing model tests pass. This is local browser validation, not a deployed jam-gate or physical-phone result.

## V12 — preserve the painting, add depth and connect the hall

The user clarified that the scene should look the same while gaining 3D and interaction. Independent shallow 3D solids now match the approved bench, noticeboard, park gates, kiosk, lamps, bin, drum and abandoned cart. At scene load, their UVs are projected from the existing original street artwork; the fixed top-down camera retains its painted appearance. This is a 2.5D relief scene, not a newly modeled free-camera environment. Foreground solids are composited by depth around the actor and the existing solid pavement boundaries remain authoritative. The kiosk has a separate shutter that lifts and jams when pulled.

The carousel has moved to the right-hand park gate (interaction point 285,273), away from the newspaper's click region. The ticket is a real thin extruded/perforated 3D object with a bent stub, geometry-built print on both faces, free rotation, zoom and a dedicated flip control. Its existing fictional date/serial are preserved. Three procedural 3D ravens react once to player proximity, flap away and reset with a fresh street; their state shares the pause-aware level clock.

Walking through the opened turnstile now starts a 2.7-second sequence: the character enters, procedural clown jaws close behind them and the view fades into `level-2.html`. The campaign enters ticket-hall through its existing passage, preserving street notes. The hall uses the previously reviewed L-shaped artwork, collision, temporary actor and a new controller with ledger, desk lamp, lost-property drawer, closed staff door and onward stairs. The lower maze wall puzzle is not transplanted into the hall. The original study page remains separate. Reloading or continuing the campaign retains hall discoveries; restarting the hall clears its own discoveries while preserving the street.

Level 3 remains approved artwork, not playable content; the hall’s onward interaction explicitly says so. No new generated background was substituted for the approved images.

Validation: 42 model tests; real desktop/touch browser input covers the newspaper, relocated toy, both ticket faces, raven reactions, kiosk shutter, pause, mouth closure, carried clues and the ticket hall ledger/drawer/onward route. Matching screenshots and results: `validation/hybrid-street/`.

The same projected-texture 3D layer renderer is used for the hall counter, staff door, shelf, lamp and tied balloons. Independent scene geometry lives in `forecourt-geometry.js` and `hall-geometry.js`; movable standalone props remain in `assets/three`.

## V14 — Level 3 playable trial (supersedes earlier pending status)

`level-3.html` implements the approved four-floor side-view concept. Enter directly for testing or finish the hall ledger/drawer and use the onward stairs. `levels/platform-model.js` owns movement, solid boundaries, jump timing, shared hazard poses, power/fuse requirements, floor checkpoints, chase, camera flash and completion. `platform-props.js` draws constructor-built meshes from `assets/three/attraction-obstacles.js` into the same illustrated scene. The background is `assets/platform-clean.png`; the original approved concept remains intact.

Left/right or A/D move, Space/W/up jumps, E operates the switch/stairs/exit, F flashes. Touch buttons provide the same actions. The final shadow is temporary character art. Test selectors intentionally skip to prepared safe landings; these are separate from normal campaign entry. Local storage retains the last platformer landing; the hall campaign's existing notes are preserved separately. A full level restart clears platformer progression only. The current playable sequence ends at the upper exit; no later level is implied.

The user's subsequent request prioritized trying this platformer. Level 2's reactive rat and further prop/collision refinement remain pending; they are not represented as completed in this pass.

## V15 — direct stairs and the wall-power inspection

Current Level 3 controls: A/D or left/right move, Space jumps, up/down or W/S traverse stairs, E examines the wall panel or uses the exit, F flashes. Touch buttons mirror these actions. `levels/platform-stairs.js` defines tread paths shared with the player’s foot positions; traversal stops or reverses with input and supports jumping onto slopes. Stairs no longer respond to E.

`power-inspection.js` and its stylesheet show the wall inscription and a live Three.js red lever from `assets/three/wall-power-lever.js`. Model state enforces the answer-before-lever-before-power order, freezes world simulation while inspecting, and resets correctly. The same lever asset is mounted visibly on the lower-floor wall.

`levels/platform-spiders.js` replaces the mirror pendulum with three proximity-triggered spiders. Warning targets lock before an 0.8-second leap, then crawl/retreat and cooldown. `assets/three/leaping-spider.js` provides the articulated geometry. Model and renderer share positions. The moving platforms to the right of the mirrors are retained.

## Level 4 concept draft — awaiting the user's visual review

Prepared `art-review/level-4.html` and `art-review/concepts/04-toy-storeroom-v1.png` for the planned toy storeroom. Proposed flow: upper-attraction exit → landing/closed reveal door → insect burst → child's drawing and winding key → real 3D music-box dial puzzle → onward door. Build brief: `LEVEL-4-PLAN.md`.

This is a review artifact only. It honors the user's direction to see each level's concept before production. No Level 4 gameplay or navigation has been added, and the Level 3 completion state remains unchanged. Approval or revisions to this specific layout are the next input needed before production.

## V16 — approved Level 4 and Level 2 reactions

This supersedes the preceding pending statuses. The user approved the toy storeroom and changed its sequence to wind-up toy → failing lights → at least twenty living toys → door escape. `level-4.html` implements it with 24 independent articulated Three.js prizes, solid furniture, optional journal drawing, a real rotating 3D wind-up inspection, timed red door, health/retry and touch controls. Level 3's completed upper exit now links to it. The older key/dial/insect sequence was a proposal and has been replaced, not left as an unfinished required feature.

Level 2 now has separate real 3D rat, balloons and teddy. Balloons pop on approach, the rat chooses an escape route away from the player and the teddy rocks, raises its arms and turns its head. All reactions pause with the level and reset on restart. New clean plates remove the stationary painted versions while retaining the approved room style.

All five new asset modules pass the official 404 harness. Validation and comparisons: `validation/toystore-v16` and `validation/hall-v16`. The original 3D game and earlier approved levels are preserved. Four chapters are playable; the remaining planned campaign is not presented as complete. Future level and final character concepts still require the user's review.


## V19 local playtest

Open `test.html` to select Levels 1–4, a platformer floor, or the toy-room quick start. All levels offer a LEVEL SELECT return link. The approved clown/bomb encounters, packed crate with tracking luminous eyes, revised four-direction investigator and deeper prop volumes are implemented. See `../validation/three-d-v19/index.html` and `../ITERATIONS.md` for checks and limitations.


## V20 candidate

Levels 1–4 retain their approved compositions with expanded 3D interactions and independent animation. See `../ITERATIONS.md` for acceptance results and `../validation/walking-v20/` for motion previews and evidence. The carousel blast uses a 6×4 transparent sheet at 30 fps, driven by simulation age; lingering smoke and fragments share that clock. The old compartment clue is removed.

Level 5 awaits concept approval: heavy pedestal desk, patterned rug, green banker lamp, ringing telephone, physical specimen shelves and jars, then a jar-break worm chase. Review `art-review/level-5.html`; do not treat its artwork as an implemented level.


## V21 — specimen library

The approved Level 5 is now playable at `level-5.html` and linked from the Level 4 exit and level-select page. Solid procedural desks/shelves, a green banker lamp, 97 jars, an opening phone receiver, wavering light, a breaking jar, a 24-frame worm and swept bile collisions replace the static concept props. The rug and architecture remain an approved painted plate. The phone checkpoint skips the completed call for testing; restart resets it. All encounter motion, sound and lighting pause together. Read-only telemetry is `window.frightLibrary`.

The library is now 1,680 pixels wide, with a following camera, alternating shelf obstacles, a far-end exit and a 2.4-second unlatching action. The investigator is 68 pixels tall in this room; the entrance has solid jambs and separately drawn overhead trim.

The Level 4 crate reserves its full base/wheel clearance rather than only the slanted painted floor polygon. A toy landing was adjusted to remain outside that solid area. See `../validation/library-v21/` for comparisons and test evidence.
