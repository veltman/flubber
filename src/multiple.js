import { interpolateRing } from "./interpolate.js";
import { toPathString } from "./svg.js";
import normalizeRing from "./normalize.js";
import triangulate from "./triangulate.js";
import pieceOrder from "./order.js";

export function separate(
  fromShape,
  toShapes,
  { maxSegmentLength = 10, string = true, single = false } = {}
) {
  let fromRing = normalizeRing(fromShape, maxSegmentLength),
    fromRings = triangulate(fromRing, toShapes.length),
    toRings = toShapes.map(d => normalizeRing(d, maxSegmentLength));

  let order = pieceOrder(fromRings, toRings),
    interpolators = order.map((d, i) => interpolateRing(fromRings[d], toRings[i], string));

  if (single) {
    let merged = toPathString(fromRing);
    if (string) {
      return t => (t < 1e-4 ? merged : interpolators.map(i => i(t)).join(" "));
    }
    return t => interpolators.map(i => i(t));
  }

  return interpolators;
}

export function combine(
  fromShapes,
  toShape,
  { maxSegmentLength = 10, string = true, single = false } = {}
) {
  let interpolators = separate(toShape, fromShapes, { maxSegmentLength, string, single });
  if (single) {
    return t => (1-t < 1e-4 ? toShape : interpolators(1 - t));
  }
  return interpolators.map(fn => t => fn(1 - t));
}
