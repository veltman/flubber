import { supertape } from "./utils.js";
import normalizeRing from "../src/normalize.js";
import interpolate from "../src/interpolate.js";
import { separate, combine } from "../src/multiple.js";
import { toPathString, splitPathString, pathStringToRing } from "../src/svg.js";

let tape = supertape();

let square = "M0,0L100,0L100,100L0,100Z",
  halfcircle = "M0,0 A50,50,0,0,0,100,0Z",
  bezier =
    "M636.5,315c-0.4-18.7,1.9-27.9-5.3-35.9c-22.7-25-107.3-2.8-118.3,35.9c-7,24.4,20.6,37.2,16,71c-4,29.6-30.8,60.7-56.5,61.1c-30.8,0.4-32.9-43.8-81.7-70.2c-50.9-27.6-110.1-12.9-125.2-9.2c-66.1,16.4-82.2,56.9-109.2,47.3c-38-13.6-55.9-112.1-19.8-143.5c39-34,121.2,27.7,148.1-3.8c18-21.1,3.1-74.3-25.2-105.3c-31.1-34.1-70.1-32.4-105.3-76.3c-8.2-10.2-16.9-23.8-15.3-39.7c1.2-11.4,7.5-23.3,15.3-29c33.8-25,101.6,62.6,193.1,59.5c40.1-1.3,38.7-18.5,99.2-38.9c126.2-42.6,242.4-4.9,297.7,13c54.7,17.7,105.4,35,129.8,82.4c13,25.3,22.9,67.7,4.6,87c-11.6,12.3-25.1,5.1-46.6,20.6c-2.8,2-28.9,21.4-32.1,49.6c-3.1,27.4,18.7,35,29,70.2c8.8,30.1,8.5,77.8-18.3,99.2c-32.3,25.8-87,0.6-100-5.3c-69.6-32-67.2-88.4-73.3-109.2z";

tape("toPathString", function(test) {
  test.equal(toPathString([[0, 0], [1, 1], [2, 2]]), "M0,0L1,1L2,2Z");
  test.end();
});

tape("splitPathString", function(test) {
  // Single
  test.deepEqual(splitPathString("M1,2L3,4Z"), ["M1 2L3 4Z"]);

  // Multiple
  test.deepEqual(splitPathString("M1,2L3,4ZM5,6L7,8Z"), ["M1 2L3 4Z", "M5 6L7 8Z"]);

  // Whitespace
  test.deepEqual(splitPathString("M1,2L3,4Z   M5,6L7,8Z"), ["M1 2L3 4Z", "M5 6L7 8Z"]);
  test.deepEqual(splitPathString("  M1,2L3,4Z M5,6L7,8Z"), ["M1 2L3 4Z", "M5 6L7 8Z"]);
  test.deepEqual(splitPathString("  M1,2L3,4Z M5,6L7,8Z  "), ["M1 2L3 4Z", "M5 6L7 8Z"]);

  // Relative
  test.deepEqual(splitPathString("M1,2l2,2Z m4,4l2,2Z"), ["M1 2L3 4Z", "M5 6L7 8Z"]);

  // Implicit lineto
  test.deepEqual(splitPathString("M1,2l2,2Z m4,4 2,2Z"), ["M1 2L3 4Z", "M5 6L7 8Z"]);

  test.end();
});

tape("pathStringToRing general", function(test) {
  let halfcircle = "M0,0 A50,50,0,0,0,100,0Z",
    bezier =
      "M636.5,315c-0.4-18.7,1.9-27.9-5.3-35.9c-22.7-25-107.3-2.8-118.3,35.9c-7,24.4,20.6,37.2,16,71c-4,29.6-30.8,60.7-56.5,61.1c-30.8,0.4-32.9-43.8-81.7-70.2c-50.9-27.6-110.1-12.9-125.2-9.2c-66.1,16.4-82.2,56.9-109.2,47.3c-38-13.6-55.9-112.1-19.8-143.5c39-34,121.2,27.7,148.1-3.8c18-21.1,3.1-74.3-25.2-105.3c-31.1-34.1-70.1-32.4-105.3-76.3c-8.2-10.2-16.9-23.8-15.3-39.7c1.2-11.4,7.5-23.3,15.3-29c33.8-25,101.6,62.6,193.1,59.5c40.1-1.3,38.7-18.5,99.2-38.9c126.2-42.6,242.4-4.9,297.7,13c54.7,17.7,105.4,35,129.8,82.4c13,25.3,22.9,67.7,4.6,87c-11.6,12.3-25.1,5.1-46.6,20.6c-2.8,2-28.9,21.4-32.1,49.6c-3.1,27.4,18.7,35,29,70.2c8.8,30.1,8.5,77.8-18.3,99.2c-32.3,25.8-87,0.6-100-5.3c-69.6-32-67.2-88.4-73.3-109.2z";

  test.inDelta(
    pathStringToRing(halfcircle, 50).ring,
    [
      [0, 0],
      [17.25457763671875, 37.80250930786133],
      [57.125911712646484, 49.49604034423828],
      [92.07535552978516, 27.02345085144043],
      [85.70057678222656, -0.000012940427041030489],
      [42.85029602050781, -0.000006470214884757297]
    ],
    0.5
  );

  test.inDelta(
    pathStringToRing(bezier, 600).ring,
    [
      [636.5, 315],
      [287.3954162597656, 363.1767578125],
      [271.6760559082031, 178.45318603515625],
      [457.7559814453125, 34.372894287109375],
      [866.4840698242188, 227.6297607421875]
    ],
    0.5
  );

  test.end();
});

tape("interpolate preserve string at t=0, t=1", function(test) {
  let interpolator = interpolate(halfcircle, bezier);

  test.deepEqual(interpolator(0), halfcircle);
  test.deepEqual(interpolator(1), bezier);

  let ringInterpolator = interpolate(halfcircle, bezier, { string: false }),
    first = ringInterpolator(0),
    last = ringInterpolator(1);

  test.deepEqual(first.length, last.length);

  test.end();
});

tape("pathStringToRing preserve", function(test) {
  let square1 = "M0,0L100,0L100,100L0,100Z",
    square2 = "M0,0H100V100H0Z",
    square3 = "M0,0h100v100h-100Z",
    original = [[0, 0], [100, 0], [100, 100], [0, 100]],
    bisected = [[0, 0], [50, 0], [100, 0], [100, 50], [100, 100], [50, 100], [0, 100], [0, 50]];

  test.deepEqual(pathStringToRing(square1, 125).ring, original);
  test.deepEqual(pathStringToRing(square2, 125).ring, original);
  test.deepEqual(pathStringToRing(square3, 125).ring, original);

  // Not bisected
  test.deepEqual(pathStringToRing(square1, 90).ring, original);
  test.deepEqual(pathStringToRing(square2, 90).ring, original);
  test.deepEqual(pathStringToRing(square3, 90).ring, original);

  test.deepEqual(normalizeRing(square1, 90), bisected);
  test.deepEqual(normalizeRing(square2, 90), bisected);
  test.deepEqual(normalizeRing(square3, 90), bisected);

  test.end();
});

tape("pathStringToRing produces at least 3 points", function(test) {
  let infinite = pathStringToRing(halfcircle, Infinity).ring,
    tooBig = pathStringToRing(halfcircle, 100000).ring;

  test.deepEqual(infinite, tooBig);
  test.assert(Array.isArray(infinite) && infinite.length === 3);
  test.assert(infinite.every(d => Array.isArray(d) && d.length === 2));

  test.end();
});
