# Fright House

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

All 3D geometry is JavaScript using Three.js constructors. The original ten prop families have three candidate modules and five-view renders. The visual-review branch adds twelve unique masks and four distinct doors, also verified from five views. Original procedural architecture, labels and surface marks complete the scene. Atlas generated the object references and five shipped audio files. See [PROVENANCE.md](PROVENANCE.md), [STYLE.md](STYLE.md) and [references/selections.json](references/selections.json).

The setting draws on seaside funhouses and the atmosphere of abandoned amusement attractions. Characters, map and story are original. No reference-game assets or gameplay code were copied. Documented 404 runtime helpers retain their Apache 2.0 license; Three.js retains its MIT license.


## Visual review build

The `codex/visual-direction` branch contains the user-directed art update: twelve unique detailed masks, distinct doors, spiral walls, modeled fabric canopy, three distorted scene reflections, varied lighting, typewriter UI, aged paper and quiet clown laughter. Collected props disappear and an evidence counter is shown at the top. This preview is not yet the published jam build.

Run `node serve.mjs`, then open `/art-preview/index.html` for the interactive asset gallery or `/art-preview/tour.html` for the lighting/mirror views. `node tests/collection.mjs` checks prop disappearance, prompt removal, count updates and a fresh start restoring the props. Full touch playthrough and local mobile gate reports are in `validation/art/` and `validation/playthrough-touch.json`.


Visual review 03 replaces the cartoon masks with twelve sculpted humanoid faces. Inspect the current set in the same asset gallery; the earlier set is archived under `references/cartoon-pass/`. Mobile gate evidence is in `validation/humanoid/mobile/`.
