import { polygonArea } from "d3-polygon";
import { pathStringToRing } from "./svg.js";
import { samePoint } from "./math.js";
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

  //No duplicate closing point for now
  if (points.length > 1 && samePoint(points[0], points[points.length - 1])) {
    points.pop();
  }

  // 3+ points to make a polygon
  if (points.length < 3) {
    throw new TypeError(INVALID_INPUT);
  }

  area = polygonArea(points);

  // Make all rings clockwise
  if (area > 0) {
    points.reverse();
  }

  if (
    !skipBisect &&
    maxSegmentLength &&
    Number.isFinite(maxSegmentLength) &&
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
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1])
    );
  });
}
