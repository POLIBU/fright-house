# Fright House

[Play the latest Fright House](https://polibu.github.io/fright-house/) · Team: **POLIBU**

A pixel-art horror adventure through an abandoned funhouse, with animated sprites, procedural Three.js objects, and twelve connected areas. Investigate, survive the attractions, escape the cart chase, and discover two endings. Collect all eleven optional belongings to unlock the police ending. Three separate maintenance pages provide the platform instructions.

## Play

Use arrows or WASD to move, E to interact, and Escape to pause. Click or tap to walk and inspect objects. Individual challenges also show their jump, flashlight or attack controls. Sound can be muted. Reading collected instructions pauses the room.

The public game plays directly at [polibu.github.io/fright-house/](https://polibu.github.io/fright-house/). Room URLs also live at the root. Old `/two-d/` bookmarks redirect to the matching page and preserve their query parameters. The earlier first-person prototype remains at `/legacy.html`.

## Run locally

Requires Node 20 or newer. No package installation is needed for the game.

```sh
npm start
# Use the URL printed by the server, then open /two-d/
npm test
npm run build
```

Use `/two-d/test.html` for local level and ending previews. `dist/` is the standalone static build. GitHub Actions tests and publishes it to GitHub Pages on each push to `main`; HTML entry points and module imports use a commit version to refresh cached scripts and styles. Three.js is vendored. Published gameplay does not call Atlas or require API keys.

## Art, sound and validation

The game combines illustrated backgrounds, sprite characters and procedural 3D props rendered with a pixelated look. Atlas-generated sound files are shipped locally; additional effects use Web Audio. Asset prompts, sources and generation details are recorded in [PROVENANCE.md](PROVENANCE.md) and the audio manifest.

Model tests cover progression and collision mechanics. Browser checks cover instruction pickups, transitions, endings, audio loading and touch layouts. Touch checks are browser emulation, not a physical-device test.

Runtime reporting, world scale, renderer accounting and verification commands are documented in [Runtime telemetry](docs/runtime-telemetry.md).

## Historical development notes

The following entries describe earlier iterations and prototypes.

## Visual review build

The `codex/visual-direction` branch contains the user-directed art update: three floating faces (one giant crooked clown), distinct doors, spiral walls, modeled fabric canopy, three distorted scene reflections, varied lighting, typewriter UI, aged paper and quiet clown laughter. Collected props disappear and an evidence counter is shown at the top. This preview is not yet the published jam build.

Run `node serve.mjs`, then open `/art-preview/index.html` for the interactive asset gallery or `/art-preview/tour.html` for the lighting/mirror views. `node tests/collection.mjs` checks prop disappearance, prompt removal, count updates and a fresh start restoring the props. Full touch playthrough and local mobile gate reports are in `validation/art/` and `validation/playthrough-touch.json`.


Visual review 03 previously replaced the cartoon masks with twelve sculpted humanoid faces. The current gallery now contains the three selected faces; earlier sets are archived under `references/cartoon-pass/` and `references/humanoid-pass/`. Mobile gate evidence is in `validation/humanoid/mobile/`.

Visual review 04 adds eight animated reaching limbs and depth-tested black smoke to the creature, with positional echoed laughter. Once it appears, fixture light drops to 21% and the spiral paint flows downward. Ten coloured balloons drift overhead; a fish-prize rack holds six plastic bags with circling flies; two corner cobwebs and a discarded prop skeleton dress the maze. The review tour includes buttons for each new attraction, chase lighting and laughter. All effects pause with the game and reset on retry. Earlier humanoid variants are archived under `references/humanoid-pass/`.

The service exit now begins **The Last Ride**, a 420 m cart escape through the foggy abandoned park beneath a red moon. A/D or the touch joystick steers across three tracks; Shift/BOOST accelerates, S/BRAKE slows, and E/LOOK BACK checks the pursuing creature. Thirteen obstacle rows leave at least one clear track. Collisions and prolonged braking let the faster outdoor monster catch up. Reaching the coast-road gate completes the game. Cart retries keep the stage checkpoint.

Use **TEST CHECKPOINTS / SKIP AHEAD** on the title screen, or **TEST CHECKPOINTS** in pause, to start the maze chase, cart ride, or final stretch with all evidence recovered. These are explicit review controls. A corner teddy has a doll-like human face in its belly and three independently tracking eyes. The creature's original coat silhouette is replaced by an irregular dark mass, ragged strands and heavier smoke. Creature and ambient laughter are louder.

Additional validation: `tests/ride-model.test.mjs`, `tests/cart-playthrough.mjs` (`CART_TOUCH=1` for real touch), `tests/maze-to-cart.mjs`, and `tests/haunting.mjs`. Reports and review screenshots are under `validation/haunting/`.

## Eight-hour refinement candidate

The local refinement series preserves V00 (`7b974913ae34`) and records accepted commits in `ITERATIONS.md`. `/art-preview/iterations.html` compares matched maze and road cameras, including moving-hazard frame sequences. `/art-preview/contact-sheet.html` audits the 29 physical maze wall panels and 25 individual lamps. `/art-preview/road.html` reviews the six obstacle families and four carnival districts.

The floor skeleton has been removed. Arrow keys turn the camera; A/D strafe in the maze and steer the cart. The three evidence displays are a drawer desk, steel trolley and carnival cabinet; maintenance has its own reinforced workbench. Collected clues queue quiet suspense events after reading. Sprinting and wall mechanisms attract the creature; sight overrides hearing, and losing sight produces a search of the last known area. Creature grunts and breathing are louder nearby and muffled behind walls.

The road now has wrecked carts, collapsed stalls, tangled beams, lifting signs, rolling barrels and stalled machinery. Advance reflectors mark their swept lanes; each row retains a clear track. Animated rendering and collision share the same hazard state. Four districts add a ticket entrance, midway, carousel yard and loading shed, with selected signs, shutters, gondolas, carousel parts and distant lights moving on pause-safe simulation time.

All refinements remain local. Browser tests are emulated desktop/touch input, not physical-phone or first-time human playtesting. Final test evidence and the strongest candidate recommendation are tracked in `ITERATIONS.md`.

## Current candidate: pixelated carnival horror

The playable game now defaults to the selected fake-2D visual treatment: low-resolution scenery, reduced colours, dithering and darkened edges. Text and controls remain full resolution. Open `/?look=smooth` for the previous smooth rendering. First-person movement is retained pending the separate fixed-camera choice.

The new beginning approaches a colourful clown-mouth facade through foggy amusement grounds, then passes a broken turnstile and empty ticket booth. F (or LIGHT) toggles the flashlight. Find the corridor switch, pass the barrel, climb to the moving-floor gallery, and open the red room door. A disturbance leads to a fall into the lower labyrinth. **The entire puzzle maze remains flat**, with an irregular 22-room footprint and varied illusion walls. Stairs and uneven floors are confined to the opening sequence.

Black double doors lead to the storage-room swarm. Other additions include a ceiling animatronic, grasping hands, specimen jars and books, rats, coloured festoon bulbs, and a player reflection in all three mirrors. The clown whispers “Come here, darling.” The cart pursuer throws axes: look back with E / LOOK BACK, steer out of the aimed track, or press F / FLASH while looking back to stun it. Flash recharges in seven seconds; it cannot recall an axe already in flight.

`/art-preview/entrance.html` reviews the new facade, doors and rooms. `/art-preview/tour.html` includes the specimen shelf. MAZE START is available alongside the existing chase/cart checkpoints. New validation is stored in `validation/iterations/v09/`; desktop and touch browser tests still require the local `PLAYWRIGHT_MODULE` and `CHROME_PATH` environment variables.


The current game begins at `two-d/index.html` and continues automatically through the connected rooms to the sunrise ending. Only the opening has a start screen; room exits fade directly into the next scene. `two-d/test.html` remains a separate room selector for development. New Atlas audio sources are documented in `two-d/audio/atlas-manifest.json`.

### Local epilogue and puzzle previews
The local selector at `two-d/test.html` now includes the playable alley, arrest, Cadillac/bedroom ending, bedside-lamp reach animation, and library book chase. Direct previews: `two-d/level-12.html`, `?preview=arrest`, `?preview=escape`, `?preview=bedroom`, `?preview=lamp`. Preview branches never insert evidence into the real save. Normal play goes from the forward cart chase to the alley; all 11 optional items select arrest, otherwise the Cadillac escape continues into the bedroom.

POCKETS lists optional evidence (one object per room, levels 1–11); near a visible object press E or use PICK UP. In the fall/cart rooms, steer into it. INSTRUCTIONS separately stores the three machine pages: open the street carousel, wind the wooden rabbit, then retrieve the falling maintenance book during the library chase. The library latch requires the book. Level 2’s ledger and cupboard remain optional. Start a fresh game from Level 1 to clear both collections; room retries preserve collections.


The Last Ride now uses fixed left/centre/right tracks and automatic forward movement. Speed rises over a roughly 70-second clear run. Its 64 hazard sections progress from single obstacles to combinations of crates, jumpable barricades, tall wreckage, slippery oil and dynamite. The pursuer wakes after the opening stretch, spits ink and releases spiderlings. The open 3D exit leads into the alley. Police tape appears only on the arrest route.

The top-right HUD counts optional secrets across the game (`SECRETS n / 11`). Journal, instructions and pockets preserve background music while menus pause gameplay; an explicit pause still stops music.
