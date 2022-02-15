const WHEEL_SCALE_SPEEDUP = 2;
const WHEEL_TRANSLATION_SPEEDUP = 2;
const DELTA_LINE_MULTIPLIER = 8;
const DELTA_PAGE_MULTIPLIER = 24;
const MAX_WHEEL_DELTA = 24;

export interface Point {
  x: number
  y: number
}

export interface WheelGesture {
  origin: Point
  scale: number
  translation: Point
  rotation?: number
}

interface Options {
  startGesture?: (wg: WheelGesture) => void
  doGesture?: (wg: WheelGesture) => void
  endGesture?: (wg: WheelGesture) => void
}

function limit(delta: number, max_delta: number) {
  return Math.sign(delta) * Math.min(max_delta, Math.abs(delta));
}

function normalizeWheel(e: WheelEvent) {
  let dx = e.deltaX;
  let dy = e.deltaY;
  if (e.shiftKey && dx === 0) {
    [dx, dy] = [dy, dx];
  }
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    dx *= DELTA_LINE_MULTIPLIER;
    dy *= DELTA_LINE_MULTIPLIER;
  } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    dx *= DELTA_PAGE_MULTIPLIER;
    dy *= DELTA_PAGE_MULTIPLIER;
  }
  return [limit(dx, MAX_WHEEL_DELTA), limit(dy, MAX_WHEEL_DELTA)];
}

function zoomer(container: HTMLElement, opts?: Options): () => void {
  function noop() {
    /* do nothing */
  }

  let options = opts || {};

  let startGesture = options.startGesture || noop;
  let doGesture = options.doGesture || noop;
  let endGesture = options.endGesture || noop;

  let wheel_gesture = null as WheelGesture | null;
  let timer: number;

  function end() {
    if (wheel_gesture) {
      endGesture(wheel_gesture);
      wheel_gesture = null;
    }
  }

  container.addEventListener(
    'wheel',
    function wheelListener(e: WheelEvent) {
      if (!wheel_gesture) {
        if (!e.ctrlKey) {
          return
        }
      }

      if (e.cancelable !== false) {
        e.preventDefault();
      }

      let [dx, dy] = normalizeWheel(e);
      
      if (!wheel_gesture) {
        wheel_gesture = {
          origin: { x: e.clientX, y: e.clientY },
          scale: 1,
          translation: { x: 0, y: 0 }
        };
        startGesture(wheel_gesture);
      }

      if (e.ctrlKey) {
        // pinch-zoom gesture
        let factor = dy <= 0 ?
          1 - WHEEL_SCALE_SPEEDUP * dy / 100 :
          1 / (1 + WHEEL_SCALE_SPEEDUP * dy / 100);
        wheel_gesture = {
          origin: { x: e.clientX, y: e.clientY },
          scale: wheel_gesture.scale * factor,
          translation: wheel_gesture.translation
        };
      } else {
        // pan gesture
        wheel_gesture = {
          origin: { x: e.clientX, y: e.clientY },
          scale: wheel_gesture.scale,
          translation: {
            x:
              wheel_gesture.translation.x -
              WHEEL_TRANSLATION_SPEEDUP * dx,
            y:
              wheel_gesture.translation.y -
              WHEEL_TRANSLATION_SPEEDUP * dy
          }
        };
      }
      doGesture(wheel_gesture);

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(end, 200);
    },
    {
      passive: false
    }
  );

  if (
    // @ts-ignore
    typeof GestureEvent !== 'undefined' &&
    typeof TouchEvent === 'undefined'
  ) {
    let in_gesture = false;
    container.addEventListener(
      'gesturestart',
      function handleGestureStart(e: any) {
        if (!in_gesture) {
          startGesture({
            translation: { x: 0, y: 0 },
            scale: e.scale,
            rotation: e.rotation,
            origin: { x: e.clientX, y: e.clientY }
          });
          in_gesture = true;
        }
        if (e.cancelable !== false) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    container.addEventListener(
      'gesturechange',
      function handleGestureChange(e: any) {
        if (in_gesture) {
          doGesture({
            translation: { x: 0, y: 0 },
            scale: e.scale,
            rotation: e.rotation,
            origin: { x: e.clientX, y: e.clientY }
          });
        }
        if (e.cancelable !== false) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    container.addEventListener('gestureend', function handleGestureEnd(e: any) {
      if (in_gesture) {
        endGesture({
          translation: { x: 0, y: 0 },
          scale: e.scale,
          rotation: e.rotation,
          origin: { x: e.clientX, y: e.clientY }
        });
        in_gesture = false;
      }
    });
  }

  return end
}

export { zoomer };