# Level 4 — The forgotten toys

Status: concept and revised sequence approved by the user; implemented locally at `two-d/level-4.html`. Level 3's upper exit links here. Future levels still require their own concept review.

## Approved sequence

Enter from the upper landing and open the storeroom door to reveal its interior. Explore around solid shelves, a workbench, the prize cage and crates. An optional child's drawing adds a warning to the journal. Inspect the wind-up rabbit beside the red exit in real 3D; drag or use rotation buttons, then turn its key three times.

The lights fade over 2.2 seconds, followed by a brief blackout. Twenty-four independent toys hop from their resting places and pursue the player around furniture. Six families have different silhouettes, damaged parts, colours and proportions. A small flashlight pool follows the player; the exit remains faintly visible. The red door bolt releases after 7.5 seconds of pursuit. Open it and walk through to finish this chapter. This replaces the earlier unapproved key-and-three-dial puzzle and insect-event proposal.

## Implementation

- The approved artwork is retained. A generated clean plate removes stationary toy/door images, while procedural Three.js toys and doors animate independently.
- Cage, shelves, bench, pedestal and crates have explicit solid footprints. Projected 3D relief preserves their painted appearance. They are fixed-camera scenery, not fully modelled freely viewable assets.
- All moving 3D assets use original Three.js constructors, with no downloaded meshes or geometry payloads.
- Toys follow a navigation field that respects furniture and walls. Contact has a recovery window; hopping toys have a brief grace period before they can hit.
- Pause, drawing and inspection freeze gameplay. Retry at the toy resets all actors, damage, lighting, doors and winding progress. Restart returns to the landing. Existing campaign notes persist.
- Keyboard, click-to-walk and touch controls remain available. Read-only `window.frightStore` exposes phase, actor states, render statistics and inspection state.
- No later level is presented as playable. The red exit ends this chapter.

## Validation

Model tests cover door/prop collision, the complete escape, 24 toys, staged light failure, pursuit, damage, pause and retry. Browser evidence and concept comparison are under `validation/toystore-v16`. The official 404 harness checks the asset modules. Desktop and emulated touch are covered; physical phone performance is not claimed.
