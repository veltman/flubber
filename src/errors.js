export const INVALID_INPUT = `All shapes must be supplied as arrays of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).
Example valid ways of supplying a shape would be:
[[0, 0], [10, 0], [10, 10]]
"M0,0 L10,0 L10,10Z"
`;

export const INVALID_INPUT_ALL = `flubber.all() expects two arrays of equal length as arguments. Each element in both arrays should be an array of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).`;

export const INVALID_PATH_STRING = `Invalid SVG path string supplied.
Path string reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
`;
