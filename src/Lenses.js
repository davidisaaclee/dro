import * as R from 'ramda'

/*
const initialState = {
	view: {
		selectedObjects: new Set(),
		dragAmount: null,
	},
	document: {
		objectCounter: 0,
		objects: {
		  root: M.GraphicObject({
				id: 'root',
				origin: M.Vector(0, 0),
				children: []
			}),
		},
	}
}
*/

// Lens State ViewState
const view = R.lensProp('view')

// Lens State DocumentState
const doc = R.lensProp('document')


// Lens State [ObjectID]
export const selectedObjectsLens =
	R.compose(view, R.lensProp('selectedObjects'));

// Lens State Vector
export const dragAmountLens =
	R.compose(view, R.lensProp('dragAmount'));

// Lens State Int
export const objectCounterLens =
	R.compose(doc, R.lensProp('objectCounter'))

// Lens State GraphicObjectSet
export const objectSetLens =
	R.compose(doc, R.lensProp('objects'))

// ObjectID -> Lens State GraphicObject
export const lensForObjectAtID = (objectID) =>
	R.compose(objectSetLens, R.lensProp(objectID))
