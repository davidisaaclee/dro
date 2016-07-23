export const extend = (spr, sub) =>
  function() { return sub(...[spr(...arguments), ...arguments]) }