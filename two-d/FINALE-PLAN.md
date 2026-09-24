# Finale — Levels 10 and 11

Status: approved and implemented. These are the final two levels requested by the user, following The Fall. This replaces the earlier 20-area production target. Levels 1–11 are playable; the old campaign manifest is a legacy prototype retained for save compatibility.

## Level 10 — The Bone Gallery

Begin exactly where Level 9 ends: the detective climbs off the dry bone pile while the landing dust settles. Children's coats, shirts, shoes and other abandoned clothing cover the surrounding floor. Their placement tells the story without a required inventory checklist.

A following top-down camera reveals eight varied scarecrows on the basement walls: sack faces, battered hats, patterned shirts and straw-filled sleeves. Their shoulders and heads turn toward the passing detective. Ceiling drips strike the floor and leave slowly fading wet patches. A short frightened recoil leads into player-controlled running toward the waiting carnival cart. No lengthy dialogue interrupts the escape.

Layout: bone landing → clothing-strewn corridor → watchful scarecrows → loading bay and cart. Keep a clear route through the scattered clothes; nineteen separate 3D garments lift softly, flutter lightly and settle underfoot without blocking the player. The solid walls, bone piles and cart have matching collision footprints. Dust hangs in lamplight; footsteps, dry bone creaks carry the scene.

The cart is a real procedural Three.js object. A broad boarding interaction automatically aligns the detective with its seat, avoiding narrow door or interaction hotspots. Boarding provides the Level 11 checkpoint.

## Level 11 — The Last Ride

The detective remains seated in the cart. Use a top-down maze of connected track corridors with T-junctions, loops, misleading branches and one route to the actual exterior exit. The camera follows the cart while showing enough space ahead to choose a turn.

The cart moves continuously. Perpendicular steering shifts it left or right within a corridor to dodge broken 3D crates. Wooden crates burst into splinters on impact. Every collision slows the cart to 48 units/second for 1.8 seconds, followed by a smooth recovery to 118. Full-width barricades can be cleared with Space, E or the touch Jump button. The pursuing spider can catch a slowed cart. Arrow keys, WASD or touch direction buttons queue the next legal junction turn; the cart snaps smoothly to the track centre. Allow a turnaround at dead ends so one wrong choice does not instantly trap the player. No perfect-frame junction input.

After six seconds of driving, a huge spider made from human arms and legs wakes at the entrance and chases the cart through the same maze. Its hands and feet grip the ground in an uneven crawling cycle. The user approved the limb-spider appearance; twelve isolated crawl and grab frames are implemented. Keep the original coarse detective sprite style, including his seated pose.

The spider follows traversable corridors using routefinding and obeys all walls. It can gain ground through shorter routes around loops, but never teleports or walks through scenery. The spider occasionally spits aimed black ink along open corridors. Dodge or jump over it; a hit leaves a dark screen splatter that drains away over 3.8 seconds. Hesitation, collisions and wrong exits let the spider close in. The pursuit supplies time pressure without an arbitrary countdown overlay.

The player wins by reaching the real exterior exit. A sunrise scene reveals a different side gate, the ghostly funhouse and distant Ferris wheel. The detective walks to his 3D car, opens its door, gets in and accelerates away. Do not claim the missing children have been rescued: the clothes are what the detective found. Catching the cart retries from the boarding checkpoint.

## Rendering and interaction constraints

- Preserve the approved top-down pixel-art look, sprite proportions, ticket-stamp controls and black-and-white dialogue treatment.
- Use constructor-built Three.js geometry for the cart, walls, gates, rail junctions and bone props. No downloaded meshes, vertex dumps or embedded meshes.
- Keep props in separate depth-sorted layers, with footprints shared by collision and pathfinding.
- Use varied scarecrows and the limb-spider as stylized horror imagery; the clothes and environment carry the story.
- Do not add pre-attack warning circles, targeting lines or narration. Only short typewriter dialogue where needed.
- Pause freezes pursuit, dust, wheels and boarding; retry restores checkpoint state.

## Implementation record

1. Gallery, cart-maze and spider concept approved by the user.
2. Implemented Level 10 geometry, floor collisions, running and reliable cart boarding.
3. Implemented Level 11 track graph, buffered turning, creature navigation and escape ending.
4. Reused approved investigator walking frames and composited him seated inside the cart. Generated twelve isolated spider crawl/grab frames.
5. Verified maze connectivity, buffered turns, reversal, pursuit, pause and retry in model checks; desktop/touch playthroughs reach the ending. Browser checks also cover Level 9 → 10 and Level 10 → 11 transitions.

Concept board: art-review/concepts/10-11-finale-v1.png
Exact built-in imagegen prompt: art-review/concepts/10-11-finale-v1-prompt.txt

Four procedural bone heaps and eight watchful scarecrows replace painted props. The frightened line is: “Are those the missing children? I have to get out fast.” The maze has 133 traversable cells, buffered junction turns, reversals, a following routefinding spider and an exterior ending.

V34: ceiling drips increased from one every .65 seconds to one every .14 seconds. Clothing contact audio removed; garments rise at most 12 pixels with a gentle cloth deformation.

## V35 — Final cinematic and environment pass

The sunrise ending now uses a constructor-built red 1950s Cadillac-style coupe with long fins, grille, chrome trim, whitewalls, working driver door and illuminated headlamps. Original synthesized C-major waltz plays during departure. Reactive autumn leaves, drifting fog, a running clown silhouette behind the gate and a following zoom/circular iris lead to the generated THE END marquee. The test selector includes a direct ending/replay card.

Level 1 opens directly on its intro: the separate splash has been removed, and a true RGBA title logo replaces the heading above the dialogue. All four 3D inspection modules use black-and-white checkerboard canvas backdrops.

Level 11 has 36 obstacles (27 crates and 9 barricades), preserving buffered steering, jump controls and ink attacks. Level 10 adds procedural trousers, socks, belts and glasses, keeping soft fabric flutter silent and glasses grounded. Level 9 adds four hanging 3D webs that briefly snag the detective and periodically spawned tumbling stones from above; collisions, pause and retry remain consistent.

Verification: desktop/touch full chase and updated fall playthroughs pass; separate browser checks cover cinematic shadow, zoom/iris/title/music/replay, direct intro and all 3D checkerboard inspectors. Model suite and asset verifier run before commit.
