# Fright House — local review validation

- Complete maze played with real mobile touch: all evidence, gates, power, phone, release and service-door transition to the cart stage passed (`touch-final.log`).
- Separate real-touch service-door transition passed (`maze-to-cart.json`).
- Complete 420 m cart route passed on keyboard and real touch without collisions (`cart-desktop.json`, `cart-touch.json`). Peak cart draw calls: 139 desktop / 131 touch.
- Cart pause, braking capture, final-stretch checkpoint and retry passed.
- Maze darkening, melting, laughter, pause freeze, approaching claws, capture audio cleanup and retry reset passed (`regression.json`).
- Teddy eyes changed orientation from two camera positions; final scene rendered without browser errors (`teddy-review.log`).
- New clown sculpt passed the five-view asset verifier: 59,566 triangles (`clown-report.json`).
- Final mobile gate: 7.5 s load on emulated 4G, 2.7 MB transfer, 220 peak draw calls, 319,448 peak triangles, no runtime errors or missing resources (`mobile-final/verdict.json`). This is Chrome mobile emulation on an Apple M5 Max, not a physical phone benchmark.
- Eight maze/ride model tests passed. Distribution has 33 modules with valid syntax and local paths; the packaged game also loaded the final-stretch checkpoint (`distribution.log`).

Earlier exploratory screenshots in this folder record intermediate art; use `creature-final.png`, `teddy.png`, `teddy-side.png`, and the playable review for the current result.
