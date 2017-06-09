import { supertape } from "./utils.js";
import * as shapes from "./shapes.js";
import normalizeRing from "../src/normalize.js";
import { INVALID_INPUT } from "../src/errors.js";

let tape = supertape();

tape("No closing point", function(test) {
  let square = shapes.square1(),
    closed = [...square, square[0]],
    fuzzy = [...square, [0, 1e-12]],
    normalized = normalizeRing(square);

  // Confirm copy
  test.notEqual(square, normalized);
  test.deepEqual(square, normalized);

  // Confirm remove endpoint
  test.notDeepEqual(closed, normalized);
  closed.pop();
  test.deepEqual(closed, normalized);

  // Confirm remove fuzzy endpoint
  test.notDeepEqual(fuzzy, normalized);
  fuzzy.pop();
  test.deepEqual(fuzzy, normalized);

  test.end();
});

tape("Matching order", function(test) {
  let square = shapes.square1(),
    reversed = shapes.square1().reverse(),
    reversedClosed = [...reversed, reversed[0]];

  // Noop
  test.deepEqual(square, normalizeRing(square));

  // Confirm matching order
  test.deepEqual(square, normalizeRing(reversed));
  test.deepEqual(square, normalizeRing(reversedClosed));

  test.end();
});

tape("Expects valid ring or string", function(test) {
  let err = new RegExp(INVALID_INPUT.slice(0, 25));

  // Invalid
  test.throws(() => normalizeRing(1), err);
  test.throws(() => normalizeRing({}), err);
  test.throws(() => normalizeRing([1, 2, 3]), err);

  // Partially valid
  test.throws(() => normalizeRing([[0, 0], [1, 1], [2, 2], "x"]), err);

  // Too short
  test.throws(() => normalizeRing([[0, 0], [1, 1]]), err);
  test.throws(() => normalizeRing([[0, 0], [1, 1], [0, 0]]), err);

  test.doesNotThrow(() => normalizeRing([[0, 0], [1, 1], [2, 2]]));

  test.end();
});
