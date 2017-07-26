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

// Use plain mean if polygon is invalid
export function polygonCentroid(polygon) {
  if (polygon.length > 2) {
    return d3Centroid(polygon);
  }
  return [
    (polygon[0][0] + polygon[polygon.length - 1][0]) / 2,
    (polygon[0][1] + polygon[polygon.length - 1][1]) / 2
  ];
}
