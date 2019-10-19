import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import buble from "rollup-plugin-buble";

export default {
  input: "index.js",
  output: {
    file: "build/flubber.js",
    format: "umd",
    name: "flubber",
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      sourceMap: false
    }),
    buble()
  ]
};
