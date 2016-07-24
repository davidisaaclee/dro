import * as R from 'ramda';

import * as M from "./Models";
import * as Actions from "./Actions";
import { Set } from "./utility/Set";

// // TODO: Move to this shape of state.
// const initState = {
//	view: {
//		selectedObjects: new Set(),
//		dragAmount: null,
//	},
//	document: {
//		objectCounter: 0,
//		objects: {
//		  root: M.GraphicObject({
//				id: 'root',
//				origin: M.Vector(0, 0),
//				children: []
//			}),
//		},
//	},
//	session: {
//	}
// }

const initialState = {
	selectedObjects: new Set(),
	objectCounter: 0,
	objects: {
	  root: M.GraphicObject({
			id: 'root',
			origin: M.Vector(0, 0),
			children: []
		}),
	},
	dragAmount: null
};

function makeRectangle(origin) {
	return M.Rectangle({
		origin: origin,
		children: [],
		size: M.Vector(100, 100)
	})
}

// ObjectID -> GraphicObject -> GraphicObject
const addChild = (childID) =>
	R.over(R.lensProp('children'), R.append(childID))

// ObjectID -> GraphicObject -> GraphicObject
const setID = (id) => R.set(R.lensProp('id'), id)

// (GraphicObject, ObjectID) -> State -> State
const insertObject = (object, parentID) => (state) => {
	let id = `object-${R.view(objectCounterLens, state)}`;

	let addObject = R.set(R.compose(objectSetLens, R.lensProp(id)), object);
	let updateID = R.over(lensForObjectAtID(id), setID(id));
	let updateCount = R.over(objectCounterLens, R.inc);
	let updateParent = R.over(lensForObjectAtID(parentID), addChild(id));

	return R.compose(updateParent, updateCount, updateID, addObject)(state);
}

// Lens State Int
const objectCounterLens = R.lensProp('objectCounter');

// Lens State GraphicObjectSet
const objectSetLens = R.lensProp('objects');

// ObjectID -> Lens State GraphicObject
const lensForObjectAtID = (objectID) =>
	R.compose(objectSetLens, R.lensProp(objectID))

// Lens State [ObjectID]
const selectedObjectsLens = R.lensProp('selectedObjects')


// Lens State Vector
const dragAmountLens = R.lensProp('dragAmount');

const mutateObject = (state, objectID, mutator) =>
	R.over(lensForObjectAtID(objectID), mutator, state)

const nullifyDrag = R.set(dragAmountLens, null)

const updateSelection = (objectIDs, extendSelection) => (previousSelectedObjects) =>
	extendSelection
		? objectIDs.reduce(Set.toggle, previousSelectedObjects)
		: new Set(objectIDs)


export function reduce(state = initialState, action) {
	switch (action.type) {
		case Actions.Types.AddRectangle:
			return insertObject(
				makeRectangle(action.parameters.origin),
				action.parameters.parent)(state);


		case Actions.Types.PickupObject:
			const resetDrag =
				R.set(dragAmountLens, M.Vector.zero);
			const selectObj =
				R.over(
					selectedObjectsLens,
					updateSelection(
						[action.parameters.objectID],
						action.parameters.extendSelection));

			return R.compose(resetDrag, selectObj)(state);


		case Actions.Types.DragObject:
			if (state.dragAmount == null) {
				return state;
			}

			return Object.assign({}, state, {
				dragAmount: action.parameters.dragAmount
			});


		case Actions.Types.DropObject:
			if (state.dragAmount == null) {
				return state;
			}

			const dropObject = (previousState, objectID) =>
				mutateObject(previousState, objectID,
					R.over(
						R.lensProp('origin'),
						(origin) => M.Vector.sum(origin, action.parameters.displacement)))
					// Object.assign({}, object, {
					//	origin: M.Vector.sum(object.origin, action.parameters.displacement)
					// }))

			const deselectIfNeeded = (state) => state
				// R.over(
				//	selectedObjectsLens,
				//	updateSelection([], action.parameters.extendSelection),
				//	state)

			return state.selectedObjects
				.asArray()
				.reduce(
					dropObject,
					deselectIfNeeded(nullifyDrag(state)));


		case Actions.Types.SelectObjects:
			return state;
			// return R.over(
			//	selectedObjectsLens,
			//	updateSelection(action.parameters.objectIDs, action.parameters.extendSelection),
			//	state)


		default:
			return state
	}
}