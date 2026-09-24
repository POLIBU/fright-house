# Fright House — style lock
Abandoned 1987 carnival joinery, distressed painted timber and tarnished brass, with elongated smiling faces and amber practical lights against cold teal maintenance rooms.

Palette: oxblood #71312f, faded ochre #bb8d42, dirty cream #d6c8a0, deep teal #244d4c, charcoal #141b1c, brass #a87d41, emergency red #d94738.
Metres: grid cell width 4.2; walls height 3.2; eye height 1.65; phone 0.45 high; backpack 0.5; creature 2.6.
Asset base y=0; front +Z. MeshStandardMaterial names timber, metal, fabric, plaster.
Unique painted masks and three framed mirrors with live distorted reflections. No gore or depiction of harmed children.
Playable floor: quiet investigation, restore power, answer ringing phone, timed escape with rotating walls obstructing pathfinding.

User references: Santa Cruz funhouse and the abandoned amusement atmosphere of Spirited Away (the user’s “spirited theme park” reference). Favor sun-faded seaside carnival construction, theatrical faces, closed amusement-park maintenance areas; do not copy logos or assert an exact real location. Title: FRIGHT HOUSE. Deadline: midnight September 25/26, 2026, Europe/Vienna.


## User-directed visual revision — September 23

The user selected faded red and cream spiral wall paint; stretched striped circus fabric overhead; unique, more detailed faces and doors; three distorted mirrors; unequal lighting with dark corners; typewriter lettering; retro tactile controls; dirty old clue paper; quiet echoed clown laughter; and disappearing collected props with a top counter.

The earlier cartoon pass used twelve original masks once each: duck, cat, clown, sun, moon, rabbit, owl, pig, fish, jester, tragedy and ringmaster. Expressions pair with the GRIN/WINK/FROWN mechanisms. The four modeled doors use an arched show frame, crooked nested frames, a pointed industrial panel and a ventilated service door. Geometry includes real socket/mouth openings, shaped shells, raised features and fasteners. Reference photographs inform construction and atmosphere; no screenshot pixels or copyrighted character models ship.

Mirrors: west passage (vertical stretch), north passage (horizontal spread), southern passage (ripple). They reflect the real scene, with one nearby visible reflection rendered per frame; other mirror surfaces are hidden during that reflection pass to avoid recursive rendering. Reflection detail is reduced on touch devices. A first-person player body is not modeled.

Lighting: warm bulbs of varied strengths, five dark/broken-fixture cells, cooler maintenance lights, shadow-casting flashlight and dim red/teal chase lighting. Canvas canopy has modeled sag and pleats with suspension ropes. Text uses locally hosted Special Elite. Paper uses procedural stains, folds, worn edges and a cup ring.

Review pages: `/art-preview/index.html` (individual masks/doors), `/art-preview/tour.html` (mirrors and room lighting). This revision is being reviewed locally before replacing the published jam build.


## Humanoid revision — visual review 03

The user replaced the cartoon/animal direction with more realistic humanoid faces built from complex shapes. That pass used twelve mounted faces with continuous sculpted cranial surfaces: anatomical brow ridges, concave eye sockets, cheekbones and hollows, nasal bridge/tip/alar forms, philtrum, lip contours, chin and jaw planes. Eyes and mouths have real apertures, and separate eyelids, ears, teeth and fine creases provide relief. These are uncanny painted human casts, not photographic scans.

Earlier cast (superseded below): Grinner, Watcher, Hollow Man, Widow, Usher, Sleeper, Penitent, Drowned, Mourner, Harlequin, Contortionist and Ringmaster. Heads differ in skull width, facial mass, nose, orbital shape, age, gaze, expression and asymmetry. The earlier cartoon modules are retained under `references/cartoon-pass/` for comparison and are no longer loaded or shipped as gameplay assets.


## Current direction — visual review 04

The latest user direction supersedes the twelve-face cast: exactly three floating decorations remain in the maze, with a 2.55 m crooked-smile clown, a small hollow cast and a sleeping face. Gate doors no longer carry repeated heads. Unused humanoid designs are archived outside the shipped assets.

Original procedural scene additions: ten drifting balloons in six faded colours; a six-bag fish-prize stall with translucent crinkled plastic, murky water, modeled fish and instanced circling flies; two triangular corner cobwebs; and a jointed fake skeleton lying beside the route. The creature has eight independently animated two-segment limbs and curling claws, plus 38 depth-tested soft smoke billows. Its reaching is visual; maze collision still determines capture.

Chase fixture intensity falls from 55% during the phone warning to 21% after the creature appears. The existing spiral texture is animated with uneven downward runs, preserving collision and layout. Echoed, pitch-shifted creature laughter reuses the existing Atlas SFX, with distance, stereo direction and wall muffling. No new paid generation, model downloads or external services were used. The local scene tour provides creature/props/lighting/audio controls for review.


## Last Ride and teddy revision

The user added a second playable escape stage beyond the service door: a winding 420 m cart route through closed booths, broken railway carts, barricades, timber, a derelict carousel and Ferris-wheel silhouettes. Dense outdoor fog, a procedural cratered red moon and warm cart headlights limit visibility while hazard reflectors identify obstacles. Three-track steering, boost energy, brake-induced pursuit, thirteen obstacle rows and a final coast-road gate form the new stage. Test checkpoints are available from the title and pause menus.

The monster no longer has a readable human coat/body: its central form is an irregular dark organic mass, torn strands and 38 depth-tested smoke billows, with the existing eight jointed arms and grasping claws. This is an original creature informed by the user's broad survival-horror references, not a copied franchise character.

An original corner teddy follows the user-supplied reference in construction: worn textured plush, teeth, dark fabric sockets and a doll-like human face in an abdomen insert. Two bear eyes and the open doll eye rotate toward the player. The reference screenshot is not shipped. Plush fibre marks and lunar surface texture are generated with canvas drawing; all meshes are built with Three.js geometry operations. The existing Atlas laugh has been mixed louder; no additional external audio, AI service or paid generation was used.
