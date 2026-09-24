# Level 4 — The forgotten toy storeroom

Status: concept prepared for user review; gameplay implementation awaits that review. This follows the user's standing direction to see the concept before each new level. Existing Level 3 approval does not approve this new layout.

The original campaign manifest assigns area 4 to `toy-store`. The implemented Level 3 has since become the upper attraction, so the new proposed connection is its upper exit → storeroom landing. Keep earlier campaign areas and original 3D game intact; reconcile the legacy abstract manifest when integrating actual Level 4 after approval.

## Experience

Return to the approved top-down view after the side-view platformer. Contrast the chase with a tense investigation in an irregular, fully enclosed room. The player opens the entry door before the stockroom is revealed. A foul side alcove emits a single brief insect burst. Damaged toys, empty eyes, stray stuffing and traces of the children suggest what happened without adding another uninterrupted chase.

The player finds a child's drawing under a toy, takes a winding key from the central prize cage, and opens a real 3D music-box inspection. Three engraved dials match the drawing's symbols. Correctly setting and winding the box releases the red onward door. Its tune briefly animates a toy's head. The drawing persists in the journal. No onward level will be represented as playable before its own concept review and implementation.

## Asset and interaction contract

- Approved painting is visual direction, not a monolithic collision-free game layer. After feedback, derive a clean plate and independent moving props.
- Cage, shelves, cabinets and door use explicit solid footprints. Preserve a continuous route around them; no empty corners beyond the level boundary.
- Music box, winding key, cage and articulated toy parts use original constructor-built Three.js modules through the existing 404 workflow. No downloaded meshes.
- Drawing is readable in close-up; music-box inspection uses a live 3D model, mouse/touch rotation, accessible dial buttons, working key and lid.
- Interior reveal, insect burst and toy-head event depend on progress and fire once per attempt. They freeze with pause/inspection and reset with checkpoints.
- Door collision and its open pose share state. Collecting the key and drawing removes their world instances.
- Start/retry checkpoints preserve previous-level journal entries. Keyboard/touch both work.

## Required validation after implementation

Verify a complete entry-to-exit route with keyboard and touch, collision around every solid, closed-door occlusion, drawing and key collection, wrong/correct dial input, opening the lid and winding the box, pause/resume and checkpoint reset. Compare matching views against the approved concept. Run the 404 asset harness, load/error checks and existing model regressions. Record limitations honestly in ITERATIONS.md.
