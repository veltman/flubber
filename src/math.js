import { toPathString } from "./svg.js";
import { polygonCentroid as d3Centroid } from "d3-polygon";

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

// Use plain mean if it's a degenerate polygon (colinear points or single point)
export function polygonCentroid(polygon) {
  return nonZeroArea(polygon) ? d3Centroid(polygon) : [
    (polygon[0][0] + polygon[polygon.length - 1][0]) / 2,
    (polygon[0][1] + polygon[polygon.length - 1][1]) / 2
  ];
}

function nonZeroArea(polygon) {

  for (let i = 0; i < polygon.length - 2; i++) {

    let a = polygon[i],
        b = polygon[i + 1],
        c = polygon[i + 2];

    if (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) {
      return true;
    }

  }

  return false;

}
