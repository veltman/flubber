import { polygonLength } from "d3-polygon";
import { polygonCentroid, interpolatePoints, distance, isFiniteNumber } from "./math.js";
import normalizeRing from "./normalize.js";
import { addPoints } from "./add.js";
import { toPathString } from "./svg.js";

export function fromCircle(x, y, radius, toShape, options) {
  return fromShape(
    circlePoints(x, y, radius),
    toShape,
    circlePath(x, y, radius),
    2 * Math.PI * radius,
    options
  );
}

export function toCircle(fromShape, x, y, radius, options) {
  let interpolator = fromCircle(x, y, radius, fromShape, options);
  return t => interpolator(1 - t);
}

export function fromRect(x, y, width, height, toShape, options) {
  return fromShape(
    rectPoints(x, y, width, height),
    toShape,
    rectPath(x, y, width, height),
    2 * width + 2 * height,
    options
  );
}

export function toRect(fromShape, x, y, width, height, options) {
  let interpolator = fromRect(x, y, width, height, fromShape, options);
  return t => interpolator(1 - t);
}

function fromShape(fromFn, toShape, original, perimeter, { maxSegmentLength = 10, string = true } = {}) {
  let toRing = normalizeRing(toShape, maxSegmentLength),
      fromRing,
      interpolator;

  // Enforce maxSegmentLength on circle/rect perimeter too
  if (isFiniteNumber(perimeter) && toRing.length < perimeter / maxSegmentLength) {
    addPoints(toRing, Math.ceil(perimeter / maxSegmentLength - toRing.length));
  }

  fromRing = fromFn(toRing);
  interpolator = interpolatePoints(fromRing, toRing, string);

  if (string) {
    return t => (t < 1e-4 ? original : interpolator(t));
  }

  return interpolator;
}

export function circlePoints(x, y, radius) {
  return function(ring) {
    let centroid = polygonCentroid(ring),
      perimeter = polygonLength([...ring, ring[0]]),
      startingAngle = Math.atan2(ring[0][1] - centroid[1], ring[0][0] - centroid[0]),
      along = 0;

    return ring.map((point, i) => {
      let angle;
      if (i) {
        along += distance(point, ring[i - 1]);
      }
      angle = startingAngle + 2 * Math.PI * (perimeter ? along / perimeter : i / ring.length);
      return [Math.cos(angle) * radius + x, Math.sin(angle) * radius + y];
    });
  };
}

// TODO splice in exact corners?
export function rectPoints(x, y, width, height) {
  return function(ring) {
    let centroid = polygonCentroid(ring),
      perimeter = polygonLength([...ring, ring[0]]),
      startingAngle = Math.atan2(ring[0][1] - centroid[1], ring[0][0] - centroid[0]),
      along = 0;

    if (startingAngle < 0) {
      startingAngle = 2 * Math.PI + startingAngle;
    }

    let startingProgress = startingAngle / (2 * Math.PI);

    return ring.map((point, i) => {
      if (i) {
        along += distance(point, ring[i - 1]);
      }
      let relative = rectPoint(
        (startingProgress + (perimeter ? along / perimeter : i / ring.length)) % 1
      );
      return [x + relative[0] * width, y + relative[1] * height];
    });
  };
}

// TODO don't do this
function rectPoint(progress) {
  if (progress <= 1 / 8) {
    return [1, 0.5 + progress * 4];
  }
  if (progress <= 3 / 8) {
    return [1.5 - 4 * progress, 1];
  }
  if (progress <= 5 / 8) {
    return [0, 2.5 - 4 * progress];
  }
  if (progress <= 7 / 8) {
    return [4 * progress - 2.5, 0];
  }
  return [1, 4 * progress - 3.5];
}

export function circlePath(x, y, radius) {
  let l = x - radius + "," + y,
    r = x + radius + "," + y,
    pre = "A" + radius + "," + radius + ",0,1,1,";

  return "M" + l + pre + r + pre + l + "Z";
}

export function rectPath(x, y, width, height) {
  let r = x + width,
    b = y + height;
  return "M" + x + "," + y + "L" + r + "," + y + "L" + r + "," + b + "L" + x + "," + b + "Z";
}
