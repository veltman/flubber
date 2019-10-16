import tape from "tape";
import {
  interpolate,
  interpolateAll,
  separate,
  combine
} from "../build/flubber.slim.js";
import * as shapes from "./shapes.js";
import { pathStringToRing } from "../src/svg.js";

tape("Multiple methods aren't available in slim bundle", function(test) {
  test.throws(interpolateAll, /slim bundle/);
  test.throws(separate, /slim bundle/);
  test.throws(combine, /slim bundle/);
  test.end();
});

tape("Headless methods in slim bundle are OK for straight lines", function(
  test
) {
  test.doesNotThrow(() => interpolate(shapes.square1(), shapes.square2()));
  test.doesNotThrow(() => pathStringToRing("M0,0L100,0L200,200Z"));
  test.doesNotThrow(() => pathStringToRing("M0,0H100V100H-100Z"));
  test.end();
});

tape("Headless methods for Bezier/arcs throw in slim bundle", function(test) {
  test.throws(
    () =>
      interpolate(
        "M169,298C100,100,500,100,400,300",
        "M422,451C100,100,500,100,411,183"
      ),
    /slim bundle/
  );
  test.throws(
    () =>
      interpolate(
        "M0 0 A 36 60 0 0 1 150.71 170.29",
        "M0 0 A 30 50 -45 0 1 215.1 109.9"
      ),
    /slim bundle/
  );
  test.end();
});
