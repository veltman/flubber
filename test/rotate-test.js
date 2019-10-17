import { supertape } from "./utils.js";
import * as shapes from "./shapes.js";
import rotate from "../src/rotate.js";

let tape = supertape();

tape("Rotate squares successfully", function(test) {
  let square = shapes.square1();

  for (let i = 0; i < 4; i++) {
    let off = offsetRing(shapes.square1(), i);

    // Rings don't match
    test[i ? "notDeepEqual" : "deepEqual"](square, off);

    rotate(off, square);

    // Equal post-rotation
    test.deepEqual(square, off);

    // Square hasn't changed
    test.deepEqual(square, shapes.square1());
  }

  test.end();
});

tape("Min Distance", function(test) {
  let triangle = shapes.triangle1(),
    alt = shapes.triangle2();

  for (let i = 0; i < 3; i++) {
    let off = offsetRing(shapes.triangle2(), i);

    // Rings don't match
    test[i ? "notDeepEqual" : "deepEqual"](alt, off);

    rotate(off, triangle);

    // Expected post-rotation
    test.deepEqual(alt, off);

    // Triangle hasn't changed
    test.deepEqual(triangle, shapes.triangle1());
  }

  test.end();
});

function offsetRing(arr, n) {
  for (let i = 0; i < n; i++) {
    arr.push(arr.shift());
  }

  return arr;
}
