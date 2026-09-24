# Refinement art specifications

All dimensions are metres. Keep the supplied red/cream spiral theme, cloth canopy, three floating faces, three distorted mirrors, teddy, fish prizes, balloons and webs.

| Furniture | Footprint / top height | Construction and wear |
|---|---|---|
| Lost-property desk | 1.00 × 0.65 / 1.07 | Four turned legs, paired drawers, brass pulls, exposed corner joints, grooved planks and a green repair patch |
| Shoe trolley | 0.99 × 0.65 / 1.07 | Four castors, thin steel posts, open wire shelf, unequal handle heights, worn brass fittings |
| Cassette cabinet | 1.00 × 0.65 / 1.07 | Red solid carcass, paired green doors, scalloped trim, angled replacement brace and a raised plinth |
| Maintenance workbench | 2.80 × 0.68 / 1.02 | Heavy legs and reinforced lower shelf, three drawers, bolted corners and screw-operated vise |

The 25 ceiling fixtures use five construction families: enamel cone, cage lantern, guarded glass globe, scalloped shade, and broken socket. Every fixture has its own drop length, radius, mounting tilt and wear tone; these are actual geometry parameters, not merely asset names. Selected pendants swing. The contact sheet renders the actual fixture meshes independently of gameplay darkness.

The 29 physical wall panels keep their structural dimensions because maze collision must remain stable. Each has two individually seeded spiral surfaces, translated/rotated paint placement, vertical aging, one to three differently sized repairs and either additional braces, lower slats or unreinforced surfaces. Position, orientation, paint seeds and repair dimensions are recorded in `validation/iterations/v02/design-specifications.json`; the latest audit is refreshed during consolidation.

The road uses six distinct obstacle constructions. The moving sign's height, rolling barrel's offset and machinery's sway come from the same model functions used for collision. Warning markers show the full affected lane, not only the hazard's current position. Every row reserves an alternate clear lane.

The park districts deliberately differ: a crooked entrance proscenium and octagonal kiosk; open midway stalls and arched arcade; a missing roof sector and animal rides in the carousel yard; corrugated loading walls, stacked crates, gantry hook and searchlight tower. Bulbs are instanced for performance while preserving individual placement and intermittent operation. None of the new scenery occupies the playable track lanes.
