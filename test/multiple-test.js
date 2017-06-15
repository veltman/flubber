import { supertape } from "./utils.js";
import { separate, combine } from "../src/multiple.js";

let tape = supertape();

let square = "M0,0L100,0L100,100L0,100Z",
  halfcircle = "M0,0 A50,50,0,0,0,100,0Z",
  bezier =
    "M636.5,315c-0.4-18.7,1.9-27.9-5.3-35.9c-22.7-25-107.3-2.8-118.3,35.9c-7,24.4,20.6,37.2,16,71c-4,29.6-30.8,60.7-56.5,61.1c-30.8,0.4-32.9-43.8-81.7-70.2c-50.9-27.6-110.1-12.9-125.2-9.2c-66.1,16.4-82.2,56.9-109.2,47.3c-38-13.6-55.9-112.1-19.8-143.5c39-34,121.2,27.7,148.1-3.8c18-21.1,3.1-74.3-25.2-105.3c-31.1-34.1-70.1-32.4-105.3-76.3c-8.2-10.2-16.9-23.8-15.3-39.7c1.2-11.4,7.5-23.3,15.3-29c33.8-25,101.6,62.6,193.1,59.5c40.1-1.3,38.7-18.5,99.2-38.9c126.2-42.6,242.4-4.9,297.7,13c54.7,17.7,105.4,35,129.8,82.4c13,25.3,22.9,67.7,4.6,87c-11.6,12.3-25.1,5.1-46.6,20.6c-2.8,2-28.9,21.4-32.1,49.6c-3.1,27.4,18.7,35,29,70.2c8.8,30.1,8.5,77.8-18.3,99.2c-32.3,25.8-87,0.6-100-5.3c-69.6-32-67.2-88.4-73.3-109.2z";

tape("separate/combine single preserve string at t=0, t=1", function(test) {
  let separator = separate(square, [halfcircle, bezier], { single: true }),
    combiner = combine([halfcircle, bezier], square, { single: true });

  test.equal(separator(0), square);
  test.equal(separator(1), [halfcircle, bezier].join(" "));
  test.equal(separator(0), combiner(1));
  test.equal(separator(1), combiner(0));

  test.end();
});

tape("separate/combine preserve string at t=1", function(test) {
  let separator = separate(square, [halfcircle, bezier]),
    combiner = combine([halfcircle, bezier], square);

  test.equal(separator[0](1), halfcircle);
  test.equal(separator[1](1), bezier);
  test.equal(separator[0](1), combiner[0](0));
  test.equal(separator[1](1), combiner[1](0));
  test.equal(separator.length, combiner.length);
  test.assert(
    separator.every(function(fn) {
      let val = fn(0.5);
      return typeof val === "string";
    })
  );

  test.end();
});
