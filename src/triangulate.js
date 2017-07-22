import earcut from "earcut";
import { createTopology, collapseTopology } from "./topology.js";

export default function(ring, numPieces) {
  return collapseTopology(createTopology(cut(ring), ring), numPieces);
}

export function cut(ring) {
  let cuts = earcut(ring.reduce((arr, point) => [...arr, point[0], point[1]], [])),
    triangles = [];

  for (let i = 0, l = cuts.length; i < l; i += 3) {
    // Save each triangle as segments [a, b], [b, c], [c, a]
    triangles.push([[cuts[i], cuts[i + 1]], [cuts[i + 1], cuts[i + 2]], [cuts[i + 2], cuts[i]]]);
  }

  return triangles;
}
