import * as R from 'ramda';
import { extend } from './utility/extend';

// --- Model --- //

const VectorCons = (x, y) => { return { x, y } }

export const Vector = Object.assign(VectorCons, {
  zero: VectorCons(0, 0),

  squareMagnitude: (vector) =>
    vector.x * vector.x + vector.y * vector.y,

  magnitude: (vector) =>
    Math.sqrt(Vector.squareMagnitude(vector)),

  negate: (v) =>
    VectorCons(-v.x, -v.y),

  sum: (v1, v2) =>
    VectorCons(v1.x + v2.x, v1.y + v2.y),

  difference: (v1, v2) =>
    Vector.sum(v1, Vector.negate(v2)),
})

export const GraphicObject = ({ id, origin = Vector.zero, children = [] }, continuation = R.identity) =>
  continuation({ id, origin, children, type: "GraphicObject" })

export const Rectangle =
  extend(
    GraphicObject,
    (base, { size }) => Object.assign(base, { size, type: "Rectangle" }))