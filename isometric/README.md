# Fright House — isometric playability study

Open http://localhost:8089/isometric/index.html. Compare with http://localhost:8089/two-d/index.html.

This separate experimental level tests a 2:1 isometric projection, faceted code-drawn art, screen-relative movement, object collision and a room hidden behind a door. It does not implement the full twenty-area plan. The temporary investigator is not an approved production sprite; no clown sprite or chase was added.

Walk with arrows/WASD, or click/tap the floor. E / EXAMINE interacts. Search the ticket counter for a clue and key; open the red door and interact again to enter its separate room. Read the drawing and return. Turn the brass lever, then follow the service corridor to the exit. F / LIGHT toggles the flashlight; Escape / PAUSE pauses. Restart clears progress.

The room is drawn by Canvas 2D using shared world coordinates and projection. Static geometry and character depth ordering demonstrate the view without rendering Three.js. Background, furnishings and temporary character are original procedural drawings; the ambient and mechanism audio reuse the current game's local files. No external services, generated production sprites or paid assets were used.

Read-only telemetry: window.frightIso exposes player/world/screen positions, room, clue, door, gate, pause and end state. It offers no state-changing test hooks.

Validation: tests/isometric.test.mjs checks projection inversion, all four screen-relative directions, collision, route changes and pause. tests/isometric-browser.mjs drives a complete desktop and emulated-touch route through clue, doorway, drawing, return, wall and exit, then checks restart. Results and screenshots are in validation/isometric. No browser errors were observed. Touch results are browser emulation, not a physical phone test.

Deliberate limits: one hall and a small reveal room; simple temporary actor; no final character design, production animation, full story or monster. The existing 2D and 3D games and build configuration remain unchanged.
