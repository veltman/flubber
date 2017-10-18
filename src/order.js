import { polygonCentroid, distance } from "./math.js";

// With 8 or fewer shapes, find the best permutation
// Skip if array is huge (9+ shapes)
export default function(start, end) {
  if (start.length > 8) {
    return start.map((d, i) => i);
  }
  let distances = start.map(p1 => end.map(p2 => squaredDistance(p1, p2)));
  return bestOrder(start, end, distances);
}

export function bestOrder(start, end, distances) {
  let min = Infinity,
    best = start.map((d, i) => i);

  function permute(arr, order = [], sum = 0) {
    for (let i = 0; i < arr.length; i++) {
      let cur = arr.splice(i, 1),
        dist = distances[cur[0]][order.length];
      if (sum + dist < min) {
        if (arr.length) {
          permute(arr.slice(), order.concat(cur), sum + dist);
        } else {
          min = sum + dist;
          best = order.concat(cur);
        }
      }
      if (arr.length) {
        arr.splice(i, 0, cur[0]);
      }
    }
  }

  permute(best);
  return best;
}

function squaredDistance(p1, p2) {
  let d = distance(polygonCentroid(p1), polygonCentroid(p2));
  return d * d;
}
