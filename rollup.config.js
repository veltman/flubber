import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import buble from "rollup-plugin-buble";

export default {
  entry: "index.js",
  dest: "build/flubber.js",
  format: "umd",
  moduleName: "flubber",
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
