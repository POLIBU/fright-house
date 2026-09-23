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

`dist/` is the standalone static site. GitHub Pages serves the built site from the `gh-pages` branch. `deployment/pages-workflow.example.yml` is an optional future Actions configuration; the current GitHub login cannot create workflows. Three.js is vendored; the deployed game does not call Atlas or use API keys.

## Validation

Automated real-input desktop and touch playthroughs reach the ending. Failure-path coverage checks pause, natural timer expiry, creature capture, and checkpoint retries. Model tests check connectivity and legal paths in all eight rotating-wall configurations. The recipe verifier passes all eleven final asset modules.

Browser tests use Playwright and Chrome; set `PLAYWRIGHT_MODULE` to an installed Playwright module if it is outside normal module resolution, `CHROME_PATH` to Chrome, and optionally `GAME_URL` to a hosted build. Run `node tests/playthrough.mjs`, `node tests/touch-playthrough.mjs`, or `node tests/failure-paths.mjs` with the development server running. Reports and screenshots are under `validation/`.

Touch validation is browser emulation, not a physical-device test. The 10–15 minute first-play target still needs human playtesting; automated routes already know the solutions.

## Art and sound

All 3D geometry is JavaScript using Three.js constructors. Ten prop families have three candidate modules and five-view renders; eleven selected modules furnish the maze. Original procedural architecture, labels and surface marks complete the scene. Atlas generated the object references and five shipped audio files. See [PROVENANCE.md](PROVENANCE.md), [STYLE.md](STYLE.md) and [references/selections.json](references/selections.json).

The setting draws on seaside funhouses and the atmosphere of abandoned amusement attractions. Characters, map and story are original. No reference-game assets or gameplay code were copied. Documented 404 runtime helpers retain their Apache 2.0 license; Three.js retains its MIT license.
