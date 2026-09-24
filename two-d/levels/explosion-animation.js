export const EXPLOSION_FRAMES = 24;
export const EXPLOSION_FPS = 30;
export const EXPLOSION_DURATION = EXPLOSION_FRAMES / EXPLOSION_FPS;
// Row-major six-column sheet; UV origin is bottom-left in Three.js.
export function explosionFrame(age) {
  const index = Math.min(EXPLOSION_FRAMES - 1, Math.max(0, Math.floor(age * EXPLOSION_FPS)));
  return { index, u: (index % 6) / 6, v: (3 - Math.floor(index / 6)) / 4,
    visible: age >= 0 && age < EXPLOSION_DURATION,
    opacity: Math.max(0, Math.min(1, (EXPLOSION_DURATION - age) / .2)) };
}
