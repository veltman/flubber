import { interpolateRing } from "./interpolate.js";
import { toPathString } from "./svg.js";
import { addPoints } from "./add.js";
import normalizeRing from "./normalize.js";
import triangulate from "./triangulate.js";
import pieceOrder from "./order.js";

export function separate(
  fromShape,
  toShapes,
  { maxSegmentLength = 10, string = true, single = false } = {}
) {
  let fromRing = normalizeRing(fromShape, maxSegmentLength);

  if (fromRing.length < toShapes.length + 2) {
    addPoints(fromRing, toShapes.length + 2 - fromRing.length);
  }

  let fromRings = triangulate(fromRing, toShapes.length),
    toRings = toShapes.map(d => normalizeRing(d, maxSegmentLength));

  let order = pieceOrder(fromRings, toRings),
    interpolators = order.map((d, i) => interpolateRing(fromRings[d], toRings[i], string));

  if (single) {
    let multiInterpolator = string
      ? t => interpolators.map(fn => fn(t)).join(" ")
      : t => interpolators.map(fn => fn(t));

    if (string) {
      let useFrom = typeof fromShape === "string" && fromShape,
        useTo = toShapes.every(s => typeof s === "string") && toShapes.join(" ");

      if (useFrom || useTo) {
        return t => (t < 1e-4 && useFrom) || (1 - t < 1e-4 && useTo) || multiInterpolator(t);
      }
    }
    return multiInterpolator;
  } else if (string) {
    return interpolators.map((fn, i) => {
      if (typeof toShapes[i] === "string") {
        return t => (1 - t < 1e-4 ? toShapes[i] : fn(t));
      }
      return fn;
    });
  }

  return interpolators;
}

export function combine(
  fromShapes,
  toShape,
  { maxSegmentLength = 10, string = true, single = false } = {}
) {
  let interpolators = separate(toShape, fromShapes, { maxSegmentLength, string, single });
  return single ? t => interpolators(1 - t) : interpolators.map(fn => t => fn(1 - t));
}
