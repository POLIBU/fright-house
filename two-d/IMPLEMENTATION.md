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
