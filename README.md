# Fright House

> **Top-down candidate:** [Play Level 1](http://localhost:8089/two-d/index.html). The approved street includes animated lights, a rotating Ferris wheel and an inspectable newspaper. [Play Level 4: the forgotten toys](http://localhost:8089/two-d/level-4.html), or [view approved concepts](http://localhost:8089/two-d/art-review/index.html). Levels 1–4 are playable; Level 2 now includes reactive balloons, a fleeing rat and an animated teddy. The full 20-area adaptation is in progress; later levels require concept review.


A browser horror puzzle game set in an abandoned funhouse in 1987. Investigate three children’s belongings, learn how the rotating walls connect the maze, restore power, and escape with the recording before the creature reaches you.

[Play Fright House](https://polibu.github.io/fright-house/) · Team: **POLIBU** · Public jam contact: pvvf418@gmail.com

## Play

Desktop: WASD to move, mouse to look, Shift to run, E to interact, J for notes, Escape to pause. Arrow keys provide alternative movement/turning; Page Up/Down adjust the view. Click the game to capture the mouse.

Touch: left thumbstick moves; drag the right side to look. Use the on-screen interact, run, notes and pause buttons. Landscape gives more room.

Investigation is untimed. Answering the phone starts a three-minute escape. Notes and puzzle screens keep that timer running; pause and leaving the tab stop it. Capture or timeout offers a checkpoint retry. Sound can be muted and the recording has written dialogue.

## Run locally

Requires Node 20 or newer. No package installation is needed for the game.

```sh
npm start
# Open http://127.0.0.1:8087
npm test
npm run build
```

`dist/` is the standalone static site. GitHub Actions tests and publishes the static build to GitHub Pages on each push to main. Three.js is vendored; the deployed game does not call Atlas or use API keys.

## Validation

Automated real-input desktop and touch playthroughs reach the ending. Failure-path coverage checks pause, natural timer expiry, creature capture, and checkpoint retries. Model tests check connectivity and legal paths in all eight rotating-wall configurations. The recipe verifier passes all eleven final asset modules.

Browser tests use Playwright and Chrome; set `PLAYWRIGHT_MODULE` to an installed Playwright module if it is outside normal module resolution, `CHROME_PATH` to Chrome, and optionally `GAME_URL` to a hosted build. Run `node tests/playthrough.mjs`, `node tests/touch-playthrough.mjs`, or `node tests/failure-paths.mjs` with the development server running. Reports and screenshots are under `validation/`.

Touch validation is browser emulation, not a physical-device test. The 10–15 minute first-play target still needs human playtesting; automated routes already know the solutions.

## Art and sound

All 3D geometry is JavaScript using Three.js constructors. The original ten prop families have three candidate modules and five-view renders. The visual-review branch uses three floating humanoid faces and four distinct doors, with the face sculpts verified from five views. Original procedural architecture, labels and surface marks complete the scene. Atlas generated the object references and five shipped audio files. See [PROVENANCE.md](PROVENANCE.md), [STYLE.md](STYLE.md) and [references/selections.json](references/selections.json).

The setting draws on seaside funhouses and the atmosphere of abandoned amusement attractions. Characters, map and story are original. No reference-game assets or gameplay code were copied. Documented 404 runtime helpers retain their Apache 2.0 license; Three.js retains its MIT license.


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
