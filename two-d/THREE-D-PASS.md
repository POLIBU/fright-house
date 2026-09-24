# Levels 1–4: next 3D pass

Preserve the approved pixel-art view and level layouts. Increase physical depth and clear collision instead of replacing the scene with a different camera or art style.

- Level 1: thicken bench, kiosk cabinet and abandoned-cart relief into solid volumes while keeping the newspaper, ticket, gates and other existing interactions reachable.
- Level 2: retain the now animated 3D teddy, balloons, rat and sixteen flying insects; extend the counter, staff-door and lost-property cabinet as complete foreground volumes.
- Level 3: add a small red-curly-haired clown shooting arcing arrows from a lower-floor stairwell. A visible aim warning locks its target before firing. Add floating bomb balloons with a pulsing 1.6-second fuse and a short local blast. Keep jump, climb, flash, power riddle and checkpoints. Freeze/reset all new state with existing pause/retry behavior.
- Level 4: retain the newly solid central crate and individual corner crates; extend shelf/bench/cabinet volumes without closing the escape loop or covering the wind-up interaction.

The clown appearance sheet is `art-review/concepts/clown-archer-v1.png`; the user approved this appearance. Hazard logic and environmental work can proceed independently. Implement accepted appearance as original procedural Three.js geometry, not an imported mesh or raster sprite.

Validate collisions and interactions on all four levels, keyboard/touch platformer hazard warnings and avoidance, pause/retry, full escape and the procedural asset contract. Compare screenshots to the accepted versions. Keep all work local.


Completed as V19. The level-select hub is `test.html`; 65 model checks, full keyboard platformer escape and desktop/emulated-touch street/hall and toy-room regressions pass. The geometry harness reports 16 clean modules plus the known tiny-fly size warning. Evidence and limitations are recorded in `../validation/three-d-v19/index.html` and `../ITERATIONS.md`.
