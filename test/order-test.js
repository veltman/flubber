import { shuffle, range } from "d3-array";
import tape from "tape";
import { bestOrder } from "../src/order.js";

let start = range(6);

tape("Best order", function(test) {
  for (let i = 0; i < 3; i++) {
    let end = start.slice(0);
    shuffle(end);
    let distances = start.map(a => end.map(b => Math.abs(a - b))),
      order = bestOrder(start, end, distances),
      ordered = order.map(d => start[d]);
    test.deepEqual(ordered, end);
  }

  test.end();
});
