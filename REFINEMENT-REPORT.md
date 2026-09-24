# Fright House — refinement comparison

**Recommended local candidate: V08.** It retains V07's authored scenery and gameplay, batches the marquee lights more efficiently, and clears old sound/investigation state between stages. The original V00 commit `7b974913ae34` remains preserved on `codex/eight-hour-baseline`. Nothing was published.

## Play and compare

- Game: http://localhost:8089/index.html
- Side-by-side maze, road and motion comparison: http://localhost:8089/art-preview/iterations.html
- Individual wall/fixture contact sheet: http://localhost:8089/art-preview/contact-sheet.html
- Road review: http://localhost:8089/art-preview/road.html
- Construction specifications: `ART-SPECIFICATIONS.md`
- Per-pass changes, improvements, regressions and retained behavior: `ITERATIONS.md`

The title and pause menus retain the chase, cart and final-stretch test checkpoints. Arrow keys turn the maze camera; A/D strafe. Cart steering, braking and boost remain unchanged as controls.

## Accepted progression

| Version | Main difference from its predecessor | Result |
|---|---|---|
| V00 | Preserved starting version | Reference only: repeated tables/lamps, simple road obstacles and floor skeleton |
| V01 | Correct screen-direction cart steering, remove skeleton, deepen grunts | Maze turning verified rather than inverted blindly |
| V02 | Four furniture constructions, five lamp families, 29 unique repaired spiral panels | Clearer silhouettes and authored landmarks; more draw calls, within budget |
| V03 | Clue-triggered suspense, quiet gaps, moving fixtures/fabric | Reading and narration hold events; pause/restart tests pass |
| V04 | Sight, hearing, investigation and last-known-position search | Walls enable misdirection; visibility-boundary backtracking found and corrected |
| V05 | Irregular arms/claws, smoke emergence, breathing and dynamic wall muffling | Stronger motion/audio warnings without increasing capture reach |
| V06 | Six road hazard families, timed motion, advance reflectors, continuous collision | Safe tracks preserved; an overly tight moving margin found and widened |
| V07 | Four carnival districts with moving signs, shutters, gondolas, carousel and distant lights | Stronger route identity; higher rendering cost |
| V08 | Batched marquee lights, reset cleanup and consolidated checks | Recommended balance of detail, behavior and rendering cost |

The three floating faces, giant clown, teddy, fish attraction, three distorted mirrors, balloons, spiral walls and circus ceiling remain. No new external or paid assets were used.

## Validation evidence

| Check | Result |
|---|---|
| Full keyboard maze → puzzles → chase → cart → coast exit | Pass, zero cart collisions, zero browser errors |
| Full touch maze → puzzles → chase → cart → coast exit | Pass, zero cart collisions, zero browser errors |
| Arrow turning at four orientations; A/D strafe; cart screen direction | Pass |
| Corridor hearing, last seen search, route graph and road collision models | 16 model tests pass |
| Suspense held during reading; pause, resume and restart | Pass |
| Creature navigation/capture and checkpoint reset | Pass on V04 and final V08; trace and retry evidence saved |
| Moving hazard clearance at every sampled animation phase | Pass; each row keeps a safe lane |
| Collision recovery steering and raised sign clearance | Pass |
| Cart pause, braking capture and final checkpoint retry | Pass |
| Individual wall/lamp audit | 29 walls, 25 fixtures, five families; rendered contact sheet and specifications saved |
| Matched still and short creature-motion captures | V00–V08 saved; road motion comparison saved for changed road versions |

## Mobile budget

Measured with browser-emulated touch input on an Apple M5 Max. Cold-load audit uses a 390×844 phone viewport at 3× density, 4 Mbps download, 60 ms latency and 2× CPU slowdown. These are not physical-phone measurements.

| Metric | Measured | Limit |
|---|---:|---:|
| Cold ready time | 7.6 seconds | 20 seconds |
| Compressed transfer | 2.7 MB | 10 MB |
| Cold/startup peak draw calls | 276 | 900 |
| Full touch maze peak draw calls | 527 | 900 |
| Full touch maze peak rendered triangles | 484,805 | 1,500,000 |
| Throttled chase/cart audit draw calls | 420 | 900 |
| Full touch cart draw calls | 392 | 900 |
| Full touch cart rendered triangles | 74,659 | 1,500,000 |
| Missing assets / browser errors | 0 / 0 | 0 / 0 |

V07's keyboard cart peak was 464 calls. V08's full keyboard cart peak is 415, with the same district designs. Instancing slightly increases triangles drawn in some distant views because the bulb batch covers a larger area; the draw-call saving is the useful tradeoff.

## Timing and remaining limits

The requested feature window ended at **07:25 Vienna on September 24**. Work ran past that cutoff; the time check at 08:11 Vienna triggered a stop to feature changes. Subsequent work is validation, packaging and reporting. Do not resume feature changes from a scheduled wakeup.

Automated routes know puzzle solutions, so these results establish functional completion rather than first-player pacing or subjective scariness. V08 is the recommended version for the user's visual and audio review. The short motion sequences complement the fixed screenshots; they do not replace playing with sound.
