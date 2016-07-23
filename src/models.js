import * as _ from 'lodash';
import { extend } from './utility/extend';

// --- Model --- //

const VectorCons = (x, y) => { return { x, y } }

export const Vector = _.extend(VectorCons, {
  zero: VectorCons(0, 0),

  squareMagnitude: (vector) =>
    vector.x * vector.x + vector.y * vector.y,

  magnitude: (vector) =>
    Math.sqrt(Vector.squareMagnitude(vector)),

  sum: (v1, v2) =>
    VectorCons(v1.x + v2.x, v1.y + v2.y),
})

export const GraphicObject = ({ origin = Vector.zero, children = [] }, continuation = _.identity) =>
  continuation({ origin, children, type: "GraphicObject" })

export const Rectangle =
  extend(
    GraphicObject,
    (base, { size }) => _.extend(base, { size, type: "Rectangle" }))