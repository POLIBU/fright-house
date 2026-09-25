# Runtime telemetry

Every published game room exports `window.__READY__` and `window.__GAME__`. The original room-specific debug snapshots remain available. There is no debug start hook: players and the official gate use the real start button and movement controls.

## Readiness

`__READY__` starts false. Room initialization must succeed, every essential image requested during loading must finish, fonts must be ready, handlers must be installed, and a complete rendered frame must have been published. Only then does it become true. Missing images, uncaught runtime errors and lost WebGL contexts fail readiness. Audio permission is unlocked by real input; it does not block visual readiness. Future optional image requests do not conceal already-running rendering work. Retries do not reload completed assets.

## Frame contract

The shared coordinator runs the room and any independent close-up animation callbacks, then replaces `__GAME__` once for the completed frame. It continues while paused and on death/ending screens.

- `pos: [x,z]`: actor world coordinates in metres. **40 canonical world pixels = 1 metre**; the platformer uses doubled artwork/model coordinates, so **80 of its model pixels = 1 metre**. This is a consistent game-world convention, not a claim about perspective sprite height. Camera pan/zoom and visual jump offsets do not change position. Cart position includes lane displacement; falling uses actual world depth. Cinematic positions follow the visible character or occupied car; a new scene resets the velocity baseline.
- `fps`: number of frame intervals divided by real RAF elapsed time over approximately the latest second. Simulation delta clamping does not affect it. The first frame has insufficient history and reports zero.
- `speed`: displacement in metres divided by real elapsed seconds. It is zero while paused/before starting and resets on start/retry, phase changes and checkpoint-return hits.
- `score`: validated, unique secret items in the same campaign storage used by the game.
- `over`: true for death/capture or the final ending's completion. It is false for a boss defeat or an ordinary room exit/completion.
- `draws`: **WebGL drawing submissions + Canvas 2D paint operations**, a conservative application rendering-work total, not a claim that the browser issues one GPU command per Canvas operation.
- `tris`: actual submitted **WebGL triangles**, including instancing, triangle strips/fans and every render/outline pass. Canvas 2D does not expose internal GPU tessellation; no triangle count is invented for it.
- `room`, `phase`, `frame`, `timestamp`, `ready`, `running`, `paused`: diagnostics. `timestamp` is the RAF timestamp in milliseconds since navigation.
- `render`: `webglDraws`, `webglTriangles`, `canvasPaints`, `clears`, per-context counts, and cumulative `initialization` counts. Context identifiers are per-page diagnostics, not stable asset identifiers.
- `assets`: pending image count and failure descriptions.

## Accounting boundaries

WebGL commands are observed at the context API, rather than reading only Three.js's last render pass. Instanced primitives multiply triangle totals by instance count. A multi-draw submission counts each constituent draw. Both onscreen and offscreen canvases are measured. Canvas paint operations include image copies, fills, strokes, text and pixel writes; transforms/path construction and clears are not paint submissions, and clears are reported separately.

Initialization work outside an animation frame, before the first ready frame, is accumulated in `render.initialization`; it is not charged repeatedly to later frames. Actual frame rendering during loading is measured normally. Cached meshes count when rebuilt; cached image copies count each time displayed. Work between frames after readiness is included in the next frame. Browser-managed HTML/CSS compositing and internal Canvas GPU batches are not observable here and are explicitly outside the GPU counters.

Floor-art caching and opaque bone batching reduce repeated work without dropping triangles, textures, materials or animated bone groups. Geometry is still constructed from the original procedural assets; no loaded mesh data is introduced.

## Verification

`tests/telemetry-instrumentation-browser.mjs` checks actual WebGL2 instancing and multiple contexts, cache rebuilds/composites, between-frame work, close-up frame coordination and detached-renderer context loss.

`tests/telemetry-browser.mjs` independently wraps native WebGL and Canvas commands before the production wrappers and compares totals frame by frame in all twelve rooms on desktop and 390×844 mobile. It also verifies delayed/failed essential assets and pause behavior.

`tests/telemetry-scenes-browser.mjs` exercises deterministic browser-only fixtures for inspections and demanding later-room states. Fixture hooks are injected into intercepted responses by the test and are never shipped. Its results are representative scene measurements, not claims of a complete real-input playthrough or a mathematically exhaustive peak.

`tests/telemetry-ride-browser.mjs` separately completes the full cart ride with real keyboard controls and multi-touch joystick/jump input. Tests write measurements and screenshots under `validation/telemetry/`.

The official gate is run unchanged against the published root URL, passing `--start="#start" --hold="#touch-joystick" --commit=<deployed-sha>` on mobile, and `--start="#start" --desktop --commit=<deployed-sha>` for the secondary desktop comparison. A passing opening gate does not certify aggregate downloads or every possible state in later rooms. Keep its unedited verdict and the separate scenario measurements together.
