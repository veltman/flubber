export { default as interpolate } from "./src/interpolate.js";
export { splitPathString, toPathString } from "./src/svg.js";
export { fromCircle, toCircle, fromRect, toRect } from "./src/shape.js";
export const separate = error("separate");
export const combine = error("combine");
export const interpolateAll = error("interpolateAll");

function error(method) {
  return function() {
    throw new Error(
      `flubber.${method}() is not available in the slim bundle, use the full bundle instead.`
    );
  };
}
