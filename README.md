[![Build Status](https://travis-ci.org/veltman/flubber.svg?branch=master)](https://travis-ci.org/veltman/flubber)

# flubber

Some best-guess methods for smoothly interpolating and 2-D shapes.

### Why?

Let's say you want to animate between two SVG paths or canvas shapes in a visualization. If you plug in their coordinates or their path strings to something like `d3.transition()`, it might work if the shapes *correspond* to each other really well - for example, turning a triangle into a different triangle. But once your shapes don't really correspond, you'll get unpredictable results with weird inversions and sudden jumps.

The goal of this library is to provide a best-guess interpolation for any two arbitrary shapes (or collections of shapes) that results in a reasonably smooth animation, without overthinking it.

### Installation

In a browser (exposes the `flubber` global):

```html
<script src="https://unpkg.com/flubber"></script>
```

With NPM:

```sh
npm install flubber
```

And then import/require it:

```js
import `flubber` // ES6
var flubber = require("flubber"); // Node classic
```

### API

#### flubber.interpolate(fromShape, toShape [, options])

`fromShape` and `toShape` should each be an array of points (a "ring") or an SVG path string. If your SVG path string includes holes or multiple shapes in a single string, everything but the first outer shape will be ignored.

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

#### flubber.toCircle(fromShape, x, y, r[, options])

Like `interpolate()`, but for the specific case of transforming the shape to a circle centered at `[x, y]` with radius `r`.

#### flubber.toRect(fromShape, x, y, width, height[, options])

Like `interpolate()`, but for the specific case of transforming the shape to a rectangle with the upper-left corner `[x, y]` and the dimensions `width` x `height`.

#### flubber.fromCircle(x, y, r, toShape[, options])

Like `toCircle()` but reversed.

#### flubber.fromRect(x, y, width, height, toShape[, options])

Like `toRect()` but reversed.

#### flubber.separate(fromShape, toShapeList[, options])

If you're trying to interpolate between a single shape and multiple shapes (for example, a group of three circles turning into a single big circle), this method will break your shapes into pieces so you can animate between the two sets.  This isn't terribly performant but it mostly gets the job done.

`fromShape` should be a ring or SVG path string, and `toShapeList` should be an array of them.

The options are the same as for `interpolate()`, with the additional option of `single`, which defaults to `false`.

If `single` is false, this returns an array of `n` interpolator functions, where `n` is the length of `toShapeList`.  If `single` is set to true this returns one interpolator that combines things into one giant path string or one big array of rings.

```js
flubber.separate([A], [B, C, D]); // returns an array of three interpolator functions

flubber.separate([A], [B, C, D], { single: true }); // returns a single interpolator function
```

#### flubber.combine(fromShapeList, toShape[, options])

Like `separate()` but reversed.

### Demos

*Note: most of these demos use D3 to keep the code concise, but this can be used with any library, or with no library at all.*

[Morphing SVG paths](https://veltman.github.io/flubber/demos/basic-svg.html)
[Morphing GeoJSON coordinates](https://veltman.github.io/flubber/demos/basic-array.html)
[Morphing to and from circles](https://veltman.github.io/flubber/demos/circles.html)
[Morphing to and from rectangles](https://veltman.github.io/flubber/demos/rects.html)
[Morphing between one shape and multiple shapes](https://veltman.github.io/flubber/demos/multiple.html) (one element)
[Morphing between one shape and multiple shapes](https://veltman.github.io/flubber/demos/multiple-distinct.html) (multiple elements)
[Vanilla JS + Canvas](https://veltman.github.io/flubber/demos/vanilla-canvas.html) (multiple elements)

### To do

* Finish these docs
* Deal with holes
* Deal with curves better
* Use curves between points for `fromCircle()` and `toCircle()`
* Accept SVG elements as arguments instead of just path strings?
* Add pre-simplification as an option
* Simulated annealing or random swapping for multishape matching?
* Support unclosed lines

### Video

[OpenVisConf 2017 talk about shape interpolation](https://www.youtube.com/watch?v=PLc1y-gim_0)

### Alternatives

[react-svg-morph](https://github.com/gorangajic/react-svg-morph) - utility for morphing between two SVGs in React

[GreenSock MorphSVG plugin](https://greensock.com/morphSVG) - GSAP shape morphing utility (costs money, not open source)

[d3.geo2rect](https://github.com/sebastian-meier/d3.geo2rect) - a plugin for morphing between GeoJSON and a rectangular SVG grid

[d3-interpolate-path](https://github.com/pbeshai/d3-interpolate-path) - a D3 interpolator to interpolate between two unclosed lines, for things like line chart transitions with mismatched data

[Wilderness](https://github.com/colinmeinke/wilderness) - an SVG manipulation and animation library

[Cirque](https://github.com/two-n/cirque) - JS utility for morphing between circles and polygons
