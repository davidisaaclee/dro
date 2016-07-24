import * as R from 'ramda';

// Lens State Int
export const objectCounterLens = R.lensProp('objectCounter');

// Lens State GraphicObjectSet
export const objectSetLens = R.lensProp('objects');

// ObjectID -> Lens State GraphicObject
export const lensForObjectAtID = (objectID) =>
	R.compose(objectSetLens, R.lensProp(objectID))

// Lens State [ObjectID]
export const selectedObjectsLens = R.lensProp('selectedObjects')

// Lens State Vector
export const dragAmountLens = R.lensProp('dragAmount');
