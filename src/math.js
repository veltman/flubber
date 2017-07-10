import { toPathString } from "./svg.js";

export function distance(a, b) {
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}

export function pointAlong(a, b, pct) {
  return [a[0] + (b[0] - a[0]) * pct, a[1] + (b[1] - a[1]) * pct];
}

export function samePoint(a, b) {
  return distance(a, b) < 1e-9;
}

export function interpolatePoints(a, b, string) {
  let interpolators = a.map((d, i) => interpolatePoint(d, b[i]));

  return function(t) {
    let values = interpolators.map(fn => fn(t));
    return string ? toPathString(values) : values;
  };
}

export function interpolatePoint(a, b) {
  return function(t) {
    return a.map((d, i) => d + t * (b[i] - d));
  };
}

export function isFiniteNumber(number) {
  return typeof number === "number" && isFinite(number);
}
