import normalizeRing from "./normalize.js";
import { addPoints } from "./add.js";
import rotate from "./rotate.js";
import { interpolatePoints } from "./math.js";

export default function(fromShape, toShape, { maxSegmentLength = 10, string = true } = {}) {
  let fromRing = normalizeRing(fromShape, maxSegmentLength),
    toRing = normalizeRing(toShape, maxSegmentLength);

  return interpolateRing(fromRing, toRing, string);
}

export function interpolateRing(fromRing, toRing, string) {
  let diff;

  diff = fromRing.length - toRing.length;

  // TODO bisect and add points in one step?
  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotate(fromRing, toRing);

  return interpolatePoints(fromRing, toRing, string);
}
