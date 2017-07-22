import { polygonArea } from "d3-polygon";
import { pathStringToRing } from "./svg.js";
import { samePoint, isFiniteNumber } from "./math.js";
import { bisect } from "./add.js";
import { INVALID_INPUT } from "./errors.js";

export default function normalizeRing(ring, maxSegmentLength) {
  let points, area, skipBisect;

  if (typeof ring === "string") {
    let converted = pathStringToRing(ring, maxSegmentLength);
    ring = converted.ring;
    skipBisect = converted.skipBisect;
  } else if (!Array.isArray(ring)) {
    throw new TypeError(INVALID_INPUT);
  }

  points = ring.slice(0);

  if (!validRing(points)) {
    throw new TypeError(INVALID_INPUT);
  }

  // TODO skip this test to avoid scale issues?
  // Chosen epsilon (1e-6) is problematic for small coordinate range
  if (points.length > 1 && samePoint(points[0], points[points.length - 1])) {
    points.pop();
  }

  area = polygonArea(points);

  // Make all rings clockwise
  if (area > 0) {
    points.reverse();
  }

  if (
    !skipBisect &&
    maxSegmentLength &&
    isFiniteNumber(maxSegmentLength) &&
    maxSegmentLength > 0
  ) {
    bisect(points, maxSegmentLength);
  }

  return points;
}

function validRing(ring) {
  return ring.every(function(point) {
    return (
      Array.isArray(point) &&
      point.length >= 2 &&
      isFiniteNumber(point[0]) &&
      isFiniteNumber(point[1])
    );
  });
}
