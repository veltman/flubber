[![Build Status](https://travis-ci.org/veltman/flubber.svg?branch=master)](https://travis-ci.org/veltman/flubber)

# flubber

Some best-guess methods for smoothly interpolating between 2-D shapes.

![Flubber in action](https://user-images.githubusercontent.com/2120446/27014160-e0ce7c04-4ea7-11e7-8da4-5dde839290eb.gif)

### Why?

Let's say you want to animate between two SVG paths or canvas shapes in a visualization. If you plug in their coordinates or their path strings to something like `d3.transition()`, it might work if the shapes *correspond* to each other really well - for example, turning a triangle into a different triangle. But once your shapes don't really correspond, you'll get unpredictable results with weird inversions and sudden jumps.

The goal of this library is to provide a best-guess interpolation for any two arbitrary shapes (or collections of shapes) that results in a reasonably smooth animation, without overthinking it.

### Installation

In a browser (exposes the `flubber` global):

```html
<script src="https://unpkg.com/flubber@0.3.0"></script>
```

With NPM:

```sh
npm install flubber
```

And then import/require it:

```js
var flubber = require("flubber"); // Node classic
import { interpolate } from "flubber" // ES6
```

### How to use

Flubber expects a shape input to be either an SVG path string or an array of `[x, y]` points (a "ring"):

```js
"M100,100 L200,100 L150,200Z" // A triangle as a path string
[[100, 100], [200, 100], [150, 200]] // A triangle as a ring
```

Flubber methods return **interpolators**, functions that you can call later with a value from 0 to 1 to get back the corresponding shape, where 0 is the beginning of the animation and 1 is the end.

Using D3, usage could look something like:

```js
var triangle = [[1, 0], [2, 2], [0, 2]],
    pentagon = [[0, 0], [2, 0], [2, 1], [1, 2], [0, 1]];

var interpolator = flubber.interpolate(triangle, pentagon);

d3.select("path")
    .transition()
    .attrTween("d", function(){ return interpolator; });
```

Without D3, usage might look something like this:
```js
// Mixing and matching input types is OK
var triangle = "M1,0 L2,2 L0,2 Z",
    pentagon = [[0, 0], [2, 0], [2, 1], [1, 2], [0, 1]];

var interpolator = flubber.interpolate(triangle, pentagon);

requestAnimationFrame(draw);

function draw(time) {
    var t = howFarAlongTheAnimationIsOnAScaleOfZeroToOne(time);
    myPathElement.setAttribute("d", interpolator(t));
    if (t < 1) {
        requestAnimationFrame(draw);
    }
}
```

Note: it doesn't matter whether your ring has a closing point identical to the first point.

### API

#### flubber.interpolate(fromShape, toShape [, options])

`fromShape` and `toShape` should each be a ring or an SVG path string. If your path string includes holes or multiple shapes in a single string, everything but the first outer shape will be ignored.

This returns a function that takes a value `t` from 0 to 1 and returns the in-between shape:

```js
var interpolator = flubber.interpolate(triangle, octagon);

interpolator(0); // returns an SVG triangle path string
interpolator(0.5); // returns something halfway between the triangle and the octagon
interpolator(1); // returns an SVG octagon path string
```

`options` can include the following keys:

`string`: whether to output results as an SVG path string or an array of points. (default: `true`)  
`maxSegmentLength`: the lower this number is, the smoother the resulting animation will be, at the expense of performance. Represents a number in pixels (if no transforms are involved). Set it to `false` or `Infinity` for no smoothing. (default: `10`)

[.interpolate() in action with SVG paths as input](https://veltman.github.io/flubber/demos/basic-svg.html)

[.interpolate() in action with GeoJSON coordinates as input](https://veltman.github.io/flubber/demos/basic-array.html)

#### flubber.toCircle(fromShape, x, y, r[, options])

Like `interpolate()`, but for the specific case of transforming the shape to a circle centered at `[x, y]` with radius `r`.

```js
var interpolator = flubber.toCircle(triangle, 100, 100, 10);

interpolator(0); // returns an SVG triangle path string
interpolator(0.5); // returns something halfway between the triangle and the circle
interpolator(1); // returns a circle path string centered at 100, 100 with a radius of 10
```

[.toCircle() in action](https://veltman.github.io/flubber/demos/circles.html)

#### flubber.toRect(fromShape, x, y, width, height[, options])

Like `interpolate()`, but for the specific case of transforming the shape to a rectangle with the upper-left corner `[x, y]` and the dimensions `width` x `height`.

```js
var interpolator = flubber.toRect(triangle, 10, 50, 100, 200);

interpolator(0); // returns an SVG triangle path string
interpolator(0.5); // returns something halfway between the triangle and the rectangle
interpolator(1); // returns a rectangle path string from [10, 50] in the upper left to [110, 250] in the lower right
```

[.toRect() in action](https://veltman.github.io/flubber/demos/rects.html)

#### flubber.fromCircle(x, y, r, toShape[, options])

Like `toCircle()` but reversed.

#### flubber.fromRect(x, y, width, height, toShape[, options])

Like `toRect()` but reversed.

#### flubber.separate(fromShape, toShapeList[, options])

If you're trying to interpolate between a single shape and multiple shapes (for example, a group of three circles turning into a single big circle), this method will break your shapes into pieces so you can animate between the two sets.  This isn't terribly performant and has some quirks but it tends to get the job done.

`fromShape` should be a ring or SVG path string, and `toShapeList` should be an array of them.

The options are the same as for `interpolate()`, with the additional option of `single`, which defaults to `false`.

If `single` is false, this returns an array of `n` interpolator functions, where `n` is the length of `toShapeList`.  If `single` is set to true this returns one interpolator that combines things into one giant path string or one big array of rings.

```js
// returns an array of two interpolator functions
var interpolators = flubber.separate(triangle, [square, otherSquare]);

d3.selectAll("path")
    .data(interpolators)
    .transition()
    .attrTween("d", function(interpolator) { return interpolator; });
```

[.separate() in action](https://veltman.github.io/flubber/demos/multiple-distinct.html)

```js
// returns a single interpolator function
var combinedInterpolator = flubber.separate(triangle, [square, otherSquare], { single: true });

// This one path element will be two squares at the end
d3.select("path")
    .transition()
    .attrTween("d", function() { return combinedInterpolator; });
```

[.separate({ single: true }) in action](https://veltman.github.io/flubber/demos/multiple.html)

#### flubber.combine(fromShapeList, toShape[, options])

Like `separate()` but reversed.

#### flubber.interpolateAll(fromShapeList, toShapeList[, options])

Like `separate()` or `combine()` but instead expects two arrays of shapes the same length (e.g. an array of three triangles turning into an array of three squares). The shapes will be matched up in the order of the arrays (the first `fromShapeList` item will turn into the first `toShapeList` item, and so on).

[.interpolateAll() in action](https://veltman.github.io/flubber/demos/all-distinct.html)

[.interpolateAll({ single: true }) in action](https://veltman.github.io/flubber/demos/all.html)

#### flubber.toPathString(ring)

A helper function for converting an array of points to an SVG path string.

```js
flubber.toPathString([[1, 1], [2, 1], [1.5, 2]]);
// Returns "M1,1L2,1L1.5,2Z"
```

#### flubber.splitPathString(pathString)

A helper function for splitting an SVG path string that might contain multiple shapes into an array of one-shape path strings.

```js
flubber.splitPathString("M1,1 L2,1 L1.5,2Z M3,3 L4,3 L3.5,4 Z");
// Returns ["M1,1 L2,1 L1.5,2Z", "M3,3 L4,3 L3.5,4 Z"]
```

### Examples

*Note: most of these demos use D3 to keep the code concise, but this can be used with any library, or with no library at all.*

[Morphing SVG paths](https://veltman.github.io/flubber/demos/basic-svg.html)

[Morphing GeoJSON coordinates](https://veltman.github.io/flubber/demos/basic-array.html)

[Morphing to and from circles](https://veltman.github.io/flubber/demos/circles.html)

[Morphing to and from rectangles](https://veltman.github.io/flubber/demos/rects.html)

[Morphing between one shape and multiple shapes](https://veltman.github.io/flubber/demos/multiple.html) (one element)

[Morphing between one shape and multiple shapes](https://veltman.github.io/flubber/demos/multiple-distinct.html) (multiple elements)

[Morphing between two sets of multiple shapes](https://veltman.github.io/flubber/demos/all.html)

[Vanilla JS + Canvas](https://veltman.github.io/flubber/demos/vanilla-canvas.html)

[Medley of different methods](https://veltman.github.io/flubber/demos/medley.html)

### To do

* Maintain original vertices when polygonizing a path string with curves
* Add `force: true` option to collapse small additional polygons onto the perimeter of the largest
* Support unclosed lines
* Use curves between points for `fromCircle()` and `toCircle()`
* Deal with holes?
* Accept SVG elements as arguments instead of just path strings?
* Add pre-simplification as an option
* Simulated annealing or random swapping for multishape matching?

### Video

[OpenVisConf 2017 talk about shape interpolation](https://www.youtube.com/watch?v=PLc1y-gim_0)

### Alternatives

[react-svg-morph](https://github.com/gorangajic/react-svg-morph) - utility for morphing between two SVGs in React

[GreenSock MorphSVG plugin](https://greensock.com/morphSVG) - GSAP shape morphing utility (costs money, not open source)

[d3.geo2rect](https://github.com/sebastian-meier/d3.geo2rect) - a plugin for morphing between GeoJSON and a rectangular SVG grid

[d3-interpolate-path](https://github.com/pbeshai/d3-interpolate-path) - a D3 interpolator to interpolate between two unclosed lines, for things like line chart transitions with mismatched data

[Wilderness](https://github.com/colinmeinke/wilderness) - an SVG manipulation and animation library

[Cirque](https://github.com/two-n/cirque) - JS utility for morphing between circles and polygons

### Credits

Many thanks to:

* Mike Bostock for [D3](https://d3js.org/) and [TopoJSON](https://github.com/topojson/topojson)
* Vladimir Agafonkin and Mapbox for [earcut](https://github.com/mapbox/earcut)
* Roger Veciana Rovira for [svg-path-properties](https://github.com/rveciana/svg-path-properties)
* Fontello for [svgpath](https://github.com/fontello/svgpath)
* Rich Harris for [Rollup](https://github.com/rollup/rollup) and [Bublé](http://buble.surge.sh/)

### License

MIT License

Copyright (c) 2017 Noah Veltman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
