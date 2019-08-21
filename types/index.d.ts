// No default export
export default undefined

export type Point = [number, number];
export type Shape = string | Point[];

export interface InterpolateOptions {
    /**
     * The lower this number is, the smoother the resulting animation will be, at the expense of performance. Represents a number in pixels (if no transforms are involved). Set it to false or Infinity for no smoothing. (default: `10`)
     */
    maxSegmentLength?: number | false
    /**
     * Whether to output results as an SVG path string or an array of points. (default: `true`)
     */
    string?: boolean
}

export interface CombinatoryInterpolationOptions extends InterpolateOptions {
    /**
     * If single is false, this returns an array of n interpolator functions, where n is the length of toShapeList. If single is set to true this returns one interpolator that combines things into one giant path string or one big array of rings. (default: `false`)
     */
    single?: boolean
}

interface InterpolateToStringOptions extends InterpolateOptions {
    string?: true
}

interface InterpolateToPointsOptions extends InterpolateOptions {
    string: false
}

interface MultipleInterpolateToStringOptions extends InterpolateOptions {
    single?: false
    string?: true
}

interface SingleInterpolateToStringOptions extends InterpolateOptions {
    single: true
    string?: true
}

interface MultipleInterpolateToPointsOptions extends InterpolateOptions {
    single?: false
    string: false
}

interface SingleInterpolateToPointsOptions extends InterpolateOptions {
    single: true
    string: false
}

/**
 * This returns a function that takes a value t from 0 to 1 and returns the in-between shape
 */
export function interpolate(fromShape: Shape, toShape: Shape, options?: InterpolateToStringOptions): (t: number) => string
export function interpolate(fromShape: Shape, toShape: Shape, options: InterpolateToPointsOptions): (t: number) => Point[]

/**
 * Like `interpolate()`, but for the specific case of transforming the shape to a circle centered at `[x, y]` with radius `r`.
 */
export function toCircle(fromShape: Shape, x: number, y: number, r: number, options?: InterpolateToStringOptions): (t: number) => string
export function toCircle(fromShape: Shape, x: number, y: number, r: number, options: InterpolateToPointsOptions): (t: number) => Point[]

/**
 * Like `interpolate()`, but for the specific case of transforming the shape to a rectangle with the upper-left corner `[x, y]` and the dimensions `width` x `height`.
 */
export function toRect(fromShape: Shape, x: number, y: number, width: number, height: number, options?: InterpolateToStringOptions): (t: number) => string
export function toRect(fromShape: Shape, x: number, y: number, width: number, height: number, options: InterpolateToPointsOptions): (t: number) => Point[]

/**
 * Like `toCircle()` but reversed.
 */
export function fromCircle(x: number, y: number, r: number, toShape: Shape, options?: InterpolateToStringOptions): (t: number) => string
export function fromCircle(x: number, y: number, r: number, toShape: Shape, options: InterpolateToPointsOptions): (t: number) => Point[]

/**
 * Like `toRect()` but reversed.
 */
export function fromRect(x: number, y: number, width: number, height: number, toShape: Shape, options?: InterpolateToStringOptions): (t: number) => string
export function fromRect(x: number, y: number, width: number, height: number, toShape: Shape, options: InterpolateToPointsOptions): (t: number) => Point[]

/**
 * If you're trying to interpolate between a single shape and multiple shapes (for example, a group of three circles turning into a single big circle), this method will break your shapes into pieces so you can animate between the two sets. This isn't terribly performant and has some quirks but it tends to get the job done.
 */
export function separate(fromShape: Shape, toShapeList: Shape[], options?: MultipleInterpolateToStringOptions): ((t: number) => string)[]
export function separate(fromShape: Shape, toShapeList: Shape[], options: MultipleInterpolateToPointsOptions): ((t: number) => Point[])[]
export function separate(fromShape: Shape, toShapeList: Shape[], options: SingleInterpolateToStringOptions): (t: number) => string
export function separate(fromShape: Shape, toShapeList: Shape[], options: SingleInterpolateToPointsOptions): (t: number) => Point[]

/**
 * Like `separate()` but reversed.
 */
export function combine(fromShapeList: Shape[], toShape: Shape, options?: MultipleInterpolateToStringOptions): ((t: number) => string)[]
export function combine(fromShapeList: Shape[], toShape: Shape, options: MultipleInterpolateToPointsOptions): ((t: number) => Point[])[]
export function combine(fromShapeList: Shape[], toShape: Shape, options: SingleInterpolateToStringOptions): (t: number) => string
export function combine(fromShapeList: Shape[], toShape: Shape, options: SingleInterpolateToPointsOptions): (t: number) => Point[]

/**
 * Like `separate()` or `combine()` but instead expects two arrays of shapes the same length (e.g. an array of three triangles turning into an array of three squares). The shapes will be matched up in the order of the arrays (the first `fromShapeList` item will turn into the first `toShapeList` item, and so on).
 */
export function interpolateAll(fromShapeList: Shape[], toShapeList: Shape[], options?: MultipleInterpolateToStringOptions): ((t: number) => string)[]
export function interpolateAll(fromShapeList: Shape[], toShapeList: Shape[], options: MultipleInterpolateToPointsOptions): ((t: number) => Point[])[]
export function interpolateAll(fromShapeList: Shape[], toShapeList: Shape[], options: SingleInterpolateToStringOptions): (t: number) => string
export function interpolateAll(fromShapeList: Shape[], toShapeList: Shape[], options: SingleInterpolateToPointsOptions): (t: number) => Point[]

/**
 * A helper function for converting an array of points to an SVG path string.
 */
export function toPathString(ring: Point[]): string

/**
 * A helper function for splitting an SVG path string that might contain multiple shapes into an array of one-shape path strings.
 */
export function splitPathString(pathString: string): string[]
