import Path from "svgpath";
import { svgPathProperties } from "svg-path-properties";
import { INVALID_INPUT } from "./errors.js";

function parsePath(str) {
  return new Path(str)
    .abs();
}

export function toPathString(ring) {
  return "M" + ring.join("L") + "Z";
}

export function splitPathString(str) {
  return parsePath(str).toString()
    .split("M")
    .map((d, i) => {
      d = d.trim();
      return i && d ? "M" + d : d;
    })
    .filter(d => d);
}

export function pathStringToRing(str, maxSegmentLength) {
  let ringPath = splitPathString(str)[0],
    points = [],
    props,
    len,
    m,
    numPoints;

  if (!ringPath) {
    throw new TypeError(INVALID_INPUT);
  }

  m = measure(ringPath);
  len = m.getTotalLength();
  numPoints = Math.ceil(len / maxSegmentLength);

  for (let i = 0; i < numPoints; i++) {
    let p = m.getPointAtLength(len * i / numPoints);
    points.push([p.x, p.y]);
  }

  return points;
}

function measure(d) {
  if (typeof module !== "undefined" && module.exports) {
    return svgPathProperties(d);
  } else {
    let svg = window.document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      path = window.document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttributeNS(null, "d", d);

    return path;
  }
}
