import * as _ from 'lodash';

// --- Model --- //
const extend = (spr, sub) =>
  function() { return sub(...[spr(...arguments), ...arguments]) }

export const Vector = (x, y) => { return { x, y } }

export const GraphicObject =
  ({ origin = Vector(0, 0), children = [] }, continuation = _.identity) =>
    continuation({ origin, children, type: "GraphicObject" })

export const Rectangle =
  extend(
    GraphicObject,
    (base, { size }) => _.extend(base, { size, type: "Rectangle" }))