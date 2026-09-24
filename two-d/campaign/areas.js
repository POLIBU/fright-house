// Campaign content manifest. These are planned areas, not twenty implemented levels.
export const AREAS = Object.freeze([
  ['street', 'Foggy carnival street', 'arrival', 'Follow the children’s trail to the entrance.'],
  ['ticket-hall', 'Ticket hall', 'arrival', 'Pass the turnstile and investigate the empty counter.'],
  ['dark-corridor', 'Dark door corridor', 'arrival', 'Find the switch and investigate the closed doors.'],
  ['toy-store', 'Foul toy storeroom', 'arrival', 'Find the child’s drawing beneath the damaged toys.'],
  ['specimen-library', 'Specimen library', 'arrival', 'Find the annotated attraction map.'],
  ['barrel-passage', 'Rolling-barrel passage', 'obstacles', 'Watch the barrel and pass through the safe gap.'],
  ['mezzanine', 'Moving-floor mezzanine', 'obstacles', 'Cross the moving panels to the workshop.'],
  ['workshop', 'Animatronic workshop', 'obstacles', 'Investigate the rig, then escape the disturbance.'],
  ['landing', 'The Fall', 'investigate', 'Steer through the shaft and reach the bones below.'],
  ['lost-property', 'Lost-property room', 'investigate', 'Recover Ellie’s backpack.'],
  ['mirrors', 'Distorted-mirror gallery', 'investigate', 'Recover Daniel’s sneaker.'],
  ['prizes', 'Abandoned prize midway', 'investigate', 'Recover the children’s cassette.'],
  ['wall-junction', 'Rotating-wall junction', 'investigate', 'Align GRIN, WINK and FROWN.'],
  ['maintenance', 'Maintenance and telephone room', 'investigate', 'Restore power, play the tape and answer the phone.'],
  ['service-passage', 'Emergency service passage', 'chase', 'Release the mechanism and unlock the service exit.'],
  ['cart-platform', 'Cart loading platform', 'boarding', 'Release the cart and collect the camera.'],
  ['ticket-track', 'Ticket-gate track', 'ride', 'Steer through the abandoned park entrance.'],
  ['midway-track', 'Midway track', 'ride', 'Avoid the stalls, signs, barrels and thrown axes.'],
  ['carousel-track', 'Carousel yard track', 'ride', 'Find a route through the stalled ride machinery.'],
  ['loading-track', 'Loading district and park exit', 'ride', 'Reach the park gate with the evidence.'],
].map(([id, title, chapter, objective], i) => Object.freeze({id, title, chapter, objective, number:i+1, optional:i===3||i===4})));
export const AREA_BY_ID = new Map(AREAS.map(a=>[a.id,a]));
export const STORY = Object.freeze({
  opening: 'You are investigating the disappearance of three children. The clues have led you to this abandoned funhouse.',
  fall: 'The floor gives way. Somewhere above you, the attraction keeps moving.',
  phone: 'The line was disconnected. The voice is not. “Come here, darling…”',
  boarding: 'The service passage opens onto the old cart track. The park gate is somewhere beyond the fog.',
  ending: 'You have the belongings. You have the tape. You still do not know where the children are.',
});
// Upper floors and story transitions are separate from the lower maze graph.
export const PASSAGES = Object.freeze([
  ['street-hall','street','ticket-hall'], ['hall-corridor','ticket-hall','dark-corridor'],
  ['toy-door','dark-corridor','toy-store'], ['library-door','dark-corridor','specimen-library'],
  ['corridor-barrel','dark-corridor','barrel-passage'], ['barrel-stairs','barrel-passage','mezzanine'],
  ['red-door','mezzanine','workshop'], ['platform-track','cart-platform','ticket-track'],
].map(([id,a,b])=>Object.freeze({id,a,b})));
export const CHECKPOINTS = Object.freeze(['street','barrel-passage','landing','maintenance','cart-platform','ticket-track']);
