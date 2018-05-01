import Path from "svgpath";
import { svgPathProperties } from "svg-path-properties";
import normalizeRing from "./normalize.js";
import { isFiniteNumber } from "./math.js";
import { INVALID_INPUT } from "./errors.js";
import bezier from "adaptive-bezier-curve";
import quadratic from "adaptive-quadratic-curve";

function parse(str) {
  return new Path(str).abs();
}

function split(parsed) {
  return parsed
    .toString()
    .split("M")
    .map((d, i) => {
      d = d.trim();
      return i && d ? "M" + d : d;
    })
    .filter(d => d);
}

export function toPathString(ring) {
  return "M" + ring.join("L") + "Z";
}

export function splitPathString(str) {
  return split(parse(str));
}

export function pathStringToRing(str, maxSegmentLength) {
  let parsed = parse(str);

  return exactRing(parsed) || approximateRing(parsed);
}

function exactRing(parsed) {
  let segments = parsed.segments || [],
    ring = [];

  if (!segments.length || segments[0][0] !== "M") {
    return false;
  }

  for (let i = 0; i < segments.length; i++) {
    let [command, x, y] = segments[i];
    if ((command === "M" && i) || command === "Z") {
      break;
    } else if (command === "M" || command === "L") {
      ring.push([x, y]);
    } else if (command === "H") {
      ring.push([x, ring[ring.length - 1][1]]);
    } else if (command === "V") {
      ring.push([ring[ring.length - 1][0], x]);
    } else {
      return false;
    }
  }

  return ring.length ? { ring } : false;
}

function approximateRing(parsed, maxSegmentLength) {
  let ringPath = Array.isArray(parsed.segments),
    ring = [],
    props,
    len,
    m,
    numPoints = 3;

  if (!ringPath) {
      throw new TypeError(INVALID_INPUT);
  }

  const segments = parsed.segments;
  for (let i = 0; i < segments.length; i++) {
    const point = segments[i];
    const prevPoint = ring[ring.length - 1];
    const letter = point.shift();
    if (letter === "M" || letter === "L") {
      ring.push(point);
    } else if (letter === "V") {
      ring.push([prevPoint[0], point[0]]);
    } else if (letter === "H") {
      ring.push([point[0], prevPoint[1]]);
    } else if (letter === "C") {
      const bezierPoint = bezier(prevPoint, [point[0], point[1]], [point[2], point[3]], [point[4], point[5]]);
      ring.push(...bezierPoint);
    } else if (letter === "Q" || letter === "S" || letter === "T") {
      if (letter === "T") {
        letter.unshift(...prevPoint);
      }
      const quadraticPoint = quadratic(prevPoint, [point[0], point[1]], [point[2], point[3]]);
      ring.push(...quadraticPoint);
    } else {
      if (point.length > 0) {
        ring.push(point);
      }
    }
  }

  return {
    ring,
    skipBisect: true
  };
}

function measure(d) {
  // Use native browser measurement if running in browser
  if (typeof window !== "undefined" && window && window.document) {
    try {
      let path = window.document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttributeNS(null, "d", d);
      return path;
    } catch (e) {}
  }
  // Fall back to svg-path-properties
  return svgPathProperties(d);
}
