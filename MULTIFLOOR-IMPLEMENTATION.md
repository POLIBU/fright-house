# New direction after V08 — multi-storey entrance and illusion labyrinth

Authorized by the user's September 24 message with the exterior attraction reference. This is new work after the closed eight-hour refinement window, not an extension of its automation. V08 is saved at `813257d90e0a` and remains reviewable.

## Playable sequence

1. Exterior at entrance level y=6: original decaying multi-storey carnival facade, angular painted cladding, faux rock tower, caged vertical shaft and broken marquee, inspired by the supplied photo. Enter through a partly broken turnstile.
2. Empty 1980s cinema ticket booth beside the entry, with glass, counter, brass grille, tickets and a faint interior lamp. Dark dogleg corridor. Player switches on flashlight (F and touch button), then finds/interacts with the light switch at the corridor end.
3. Lit obstacle passage: rolling barrel with shared render/collision state; safe timing and sidestepping. Ascending stairs/ramp to mezzanine y=9, then uneven floor panels that bob/tilt and affect camera/standing height.
4. Dogleg upper corridor: loud disturbance, explicit run cue, falling trapdoor at (0,0), visible drop through a canopy opening into the lower labyrinth. Keep the three belongings/power/phone/maze chase/cart route afterward.
5. Change labyrinth from a complete 5×5 square into a notched footprint (inactive cells 1,0; 3,1; 3,4) with an elevated eastern gallery and ramps. Preserve rotating-gate puzzle connections and evidence locations. Multiple levels: lower labyrinth y=0 and eastern gallery y=2.8, plus entry/mezzanine above. Floor geometry, player eye height, props, lights and creature height must agree.
6. Each wall gets a distinct optical-illusion design, using varied pinwheels, distorted checkers, chevrons, concentric forms and impossible-perspective motifs. Keep aged paint and per-panel repair details. User's latest request supersedes the uniform spiral-only wall treatment.

## Architecture choices

- New pure entrance model plus separate Three.js builder. Intro collision/obstacle/floor state stays separate from legacy maze and cart; keep shared input handling and pause/reset semantics.
- Intro route: exterior (0,-25) → turnstile (0,-16) → ticket booth/dark corridor → light switch (0,-2) → rolling barrel corridor → stairs at z=6..10 → moving floors across x=0..7,z=10 → upper north corridor x=7,z=10..0 → return west to trapdoor (0,0).
- New normal Begin enters the exterior. Existing chase/ride/final checkpoint buttons stay stable. Add a maze-start checkpoint for direct art/gameplay review.
- Add ACTIVE_NODES and floorHeight to the graph model. Skip inactive floor/wall cells and remove their edges; test connectivity for every gate combination among active rooms. Gate locations stay level so the rotating mechanism remains physically coherent.
- Raised cells: 4,0; 4,1; 4,2 at y=2.8. Bilinear ramps connect neighboring lower cells. Retain maintenance 4,4 and all three gate groups at lower level.
- Build floor patches and canopy from floorHeight. Wall bases/tops cover sampled terrain heights. Place props, interactable positions, lights, mirrors and faces at matching elevations. Camera and creature movement use the same floorHeight; ray/occlusion comparisons use actual eye height.
- Read-only telemetry for intro phase, flashlight, light switch, turnstile, floor/hazard motion and current floor. No writable test hooks.

## Validation before acceptance

Preserve the V08 comparison and baseline. Check exterior/booth/dark corridor, flashlight/switch, barrel contact/retry, moving floors/standing height, pause/restart, run/fall transition. Then full keyboard/touch entrance-to-cart escape, all gate configurations, raised-floor creature pursuit, and mobile budgets. Save matched previews of the new architecture and update the report with this separate version.

## Additional door references from the user

Use the four September 24 door references as original modeled designs: (1) blackened double panel doors with fluted columns/cornice, (2) a dark panel door leaking amber light around its edges and across the floor, (3) peeling red four-panel door with heavy worn frame/knob, (4) a partly open wooden door with multiple grasping hands emerging from darkness. Place them along the new entrance/maze route; proximity animates the hands. Do not replace the three existing clue mechanisms with visually misleading unrelated controls. Preserve rotating-wall collision dimensions if those mechanism panels receive new detailing.

## Latest user correction — level puzzle maze

The user explicitly requested a flat maze floor so rotating walls stay coherent. The eastern raised-gallery proposal above is superseded: all 22 active maze rooms, wall mechanisms, furnishings and creature movement now share y=0. Multiple levels and moving/uneven panels remain exclusively in the entrance/mezzanine sequence before the fall. The irregular maze footprint and distinct wall illusions remain.

## Selected rendering direction

The user chose the Fake 2D / 2.5D comparison. The low-resolution, 16-level colour treatment and illustrated edges are integrated into the playable renderer, with DOM text and controls kept sharp. `?look=smooth` retains the preceding smooth rendering for direct comparison. The camera question is pending: first-person movement is currently preserved; fixed room cameras and a visible character have not been silently substituted.

## Additions requested during implementation

Four reference-inspired door families; once-per-attempt ceiling animatronic with clanking jaw; foul storage room with flies, spiders and distressed plush props; specimen jars among books; mirror-only player body; darker creature smoke, animated clown eyes/jaw and a local whispered “Come here, darling”; rats; colourful tower/slide/clown-mouth facade; neon directions; overgrown park grounds and fog; coloured festoon bulbs. The cart pursuer now throws telegraphed axes and can be stunned with a rechargeable camera flash while the player looks back. All work remains local.
