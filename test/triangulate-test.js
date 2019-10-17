import { supertape } from "./utils.js";
import { cut } from "../src/triangulate.js";
import { createTopology, collapseTopology } from "../src/topology.js";
import * as shapes from "./shapes.js";

let tape = supertape();

tape("Triangulate a square", function(test) {
  let square = shapes.square1();

  test.deepEqual(cut(square), [
    [[2, 3], [3, 0], [0, 2]],
    [[0, 1], [1, 2], [2, 0]]
  ]);
  test.end();
});

tape("Create/collapse a triangulation", function(test) {
  let square = shapes.square1(),
    cuts = cut(square);

  let topology = createTopology(cuts, square);

  test.deepEqual(topology, {
    type: "Topology",
    objects: {
      triangles: {
        type: "GeometryCollection",
        geometries: [
          { type: "Polygon", area: 5000, arcs: [[0, 1, 2]] },
          { type: "Polygon", area: 5000, arcs: [[3, 4, -3]] }
        ]
      }
    },
    arcs: [
      [[100, 100], [0, 100]],
      [[0, 100], [0, 0]],
      [[0, 0], [100, 100]],
      [[0, 0], [100, 0]],
      [[100, 0], [100, 100]]
    ]
  });

  // Don't change anything
  let collapsed = collapseTopology(topology, 2);

  test.deepEqual(collapsed, [
    [[100, 100], [0, 100], [0, 0]],
    [[0, 0], [100, 0], [100, 100]]
  ]);
  test.equal(topology.objects.triangles.geometries.length, 2);

  collapsed = collapseTopology(topology, 1);
  test.deepEqual(collapsed, [[[100, 100], [0, 100], [0, 0], [100, 0]]]);
  test.equal(topology.objects.triangles.geometries.length, 1);

  test.throws(() => collapseTopology(topology, 2));

  test.end();
});
