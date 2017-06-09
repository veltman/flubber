import earcut from "earcut";
import { createTopology, collapseTopology } from "./topology.js";

export default function(ring, numPieces) {
  return collapseTopology(createTopology(cut(ring), ring), numPieces);
}

export function cut(ring) {
  let vertices = ring.reduce(function(arr, point) {
    return arr.concat(point.slice(0, 2));
  }, []),
    cuts = earcut(vertices),
    triangles = [];

  for (let i = 0, l = cuts.length; i < l; i += 3) {
    // Save each triangle as segments [a, b], [b, c], [c, a]
    triangles.push([[cuts[i], cuts[i + 1]], [cuts[i + 1], cuts[i + 2]], [cuts[i + 2], cuts[i]]]);
  }

  return triangles;
}
