import { supertape } from "./utils.js";
import interpolate from "../src/interpolate.js";
import { separate, combine } from "../src/multiple.js";
import { toPathString } from "../src/svg.js";
import * as shapes from "./shapes.js";

let tape = supertape();

tape("interpolate single array", function(test) {
  var interpolator = interpolate(shapes.square1(), shapes.square2(), {
    string: false,
    maxSegmentLength: Infinity
  });

  test.deepEqual(interpolator(0), shapes.square1());
  test.deepEqual(interpolator(1), shapes.square2());
  test.deepEqual(interpolator(0.5), [[50, 0], [150, 0], [150, 100], [50, 100]]);
  test.end();
});

tape("interpolate single array as string", function(test) {
  var interpolator = interpolate(shapes.square1(), shapes.square2(), {
    maxSegmentLength: Infinity
  });

  test.deepEqual(interpolator(0), toPathString(shapes.square1()));
  test.deepEqual(interpolator(1), toPathString(shapes.square2()));
  test.deepEqual(
    interpolator(0.5),
    toPathString([[50, 0], [150, 0], [150, 100], [50, 100]])
  );
  test.end();
});

tape("separate/combine arrays", function(test) {
  var separator = separate(
    shapes.square1(),
    [shapes.triangle1(), shapes.square2()],
    {
      maxSegmentLength: Infinity,
      string: false
    }
  );

  var combiner = combine(
    [shapes.triangle1(), shapes.square2()],
    shapes.square1(),
    {
      maxSegmentLength: Infinity,
      string: false
    }
  );

  test.inDelta(separator[0](0), [[0, 0], [100, 100], [0, 100]]);
  test.inDelta(
    separator[1](0),
    [[0, 0], [100, 0], [100, 70.7], [100, 100]],
    0.1
  );
  test.inDelta(separator[0](0), combiner[0](1));
  test.inDelta(separator[1](0), combiner[1](1));

  test.end();
});

tape("separate/combine arrays single", function(test) {
  var separator = separate(
    shapes.square1(),
    [shapes.triangle1(), shapes.square2()],
    {
      maxSegmentLength: Infinity,
      single: true,
      string: false
    }
  );

  test.inDelta(
    separator(0),
    [
      [[0, 0], [100, 100], [0, 100]],
      [[0, 0], [100, 0], [100, 70.7], [100, 100]]
    ],
    0.1
  );

  test.end();
});

tape("mix and match string/ring", function(test) {
  var separator = separate(
    shapes.square1(),
    [shapes.triangle1(), toPathString(shapes.square2())],
    {
      maxSegmentLength: Infinity,
      single: true,
      string: false
    }
  );

  var combiner = combine(
    [shapes.triangle1(), shapes.square2()],
    toPathString(shapes.square1()),
    {
      maxSegmentLength: Infinity,
      single: true,
      string: false
    }
  );

  test.inDelta(
    separator(0),
    [
      [[0, 0], [100, 100], [0, 100]],
      [[0, 0], [100, 0], [100, 70.7], [100, 100]]
    ],
    0.1
  );
  test.deepEqual(separator(0), combiner(1));

  test.end();
});

tape("separate/combine arrays with too few points", function(test) {
  var separator = separate(
    shapes.triangle1(),
    [shapes.square1(), shapes.square2()],
    {
      maxSegmentLength: Infinity,
      string: false
    }
  );

  test.assert(separator.length === 2);

  separator.forEach(function(fn) {
    test.assert(Array.isArray(fn(0.5)) && fn(0.5).length === 4);
  });

  test.end();
});
