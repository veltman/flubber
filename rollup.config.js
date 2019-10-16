import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import buble from "rollup-plugin-buble";
import virtual from "rollup-plugin-virtual";

const plugins = [
  resolve({
    mainFields: ["module", "jsnext:main", "main"]
  }),
  commonjs({
    sourceMap: false
  }),
  buble()
];

export default [
  {
    input: "index.js",
    output: {
      file: "build/flubber.js",
      format: "umd",
      name: "flubber"
    },
    plugins
  },
  {
    input: "index.single.js",
    output: {
      file: "build/flubber.slim.js",
      format: "umd",
      name: "flubber"
    },
    plugins: [
      virtual({
        "svg-path-properties": `export function svgPathProperties(){ throw new Error("Using SVG path strings with Bezier curves and arcs is not possible outside of a browser context with Flubber's slim bundle, use the full bundle instead."); }`
      }),
      ...plugins
    ]
  }
];
