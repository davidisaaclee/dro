import * as R from 'ramda';
import * as M from "./Models";
import * as Actions from "./Actions";
import { Set } from "./utility/Set";
import * as L from "./Lenses";

// TODO: Move to this shape of state.
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

// const initialState = {
//	selectedObjects: new Set(),
//	objectCounter: 0,
//	objects: {
//	  root: M.GraphicObject({
//			id: 'root',
//			origin: M.Vector(0, 0),
//			children: []
//		}),
//	},
//	dragAmount: M.Vector.zero
// };

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
const setObjectID = (id) => R.set(R.lensProp('id'), id)

// (GraphicObject, ObjectID) -> State -> State
const insertObject = (object, parentID) => (state) => {
	let id = `object-${R.view(L.objectCounterLens, state)}`;

	let addObject = R.set(R.compose(L.objectSetLens, R.lensProp(id)), object);
	let updateID = R.over(L.lensForObjectAtID(id), setObjectID(id));
	let updateCount = R.over(L.objectCounterLens, R.inc);
	let updateParent = R.over(L.lensForObjectAtID(parentID), addChild(id));

	console.log('s', updateID(addObject(state)));

	return R.compose(updateParent, updateCount, updateID, addObject)(state);
}

const mutateObject = (state, objectID, mutator) =>
	R.over(L.lensForObjectAtID(objectID), mutator, state)

const nullifyDrag = R.set(L.dragAmountLens, null)


export function reduce(state = initialState, action) {
	switch (action.type) {
		case Actions.Types.AddRectangle:
			return insertObject(
				makeRectangle(action.parameters.origin),
				action.parameters.parent)(state);


		case Actions.Types.DragSelectedObjects:
			return R.set(
				L.dragAmountLens,
				action.parameters.displacement,
				state);


		case Actions.Types.SelectObjects:
			const insertSelections = (objectIDs, extendSelection) => (previousSelectedObjects) =>
				extendSelection
					? objectIDs.reduce(Set.insert, previousSelectedObjects)
					: new Set(objectIDs)

			return R.over(
				L.selectedObjectsLens,
				insertSelections(
					action.parameters.objectIDs,
					action.parameters.extendSelection),
				state)


		case Actions.Types.ToggleSelectObjects:
			const toggleSelections = (objectIDs, extendSelection) => (previousSelectedObjects) =>
				extendSelection
					? objectIDs.reduce(Set.toggle, previousSelectedObjects)
					: new Set(objectIDs)

			return R.over(
				L.selectedObjectsLens,
				toggleSelections(
					action.parameters.objectIDs,
					action.parameters.extendSelection),
				state)


		case Actions.Types.SoftReplaceObjectSelection:
			let { objectID } = action.parameters;

			if (R.view(L.selectedObjectsLens, state).contains(objectID)) {
				return state;
			} else {
				return R.set(L.selectedObjectsLens, new Set([objectID]), state);
			}


		case Actions.Types.MoveSelectedObjects:
			const moveObject = (displacement) =>
				R.over(
					R.lensProp('origin'),
					R.curry(M.Vector.sum)(displacement))

			const moveAllObjects = (state) =>
				R.view(L.selectedObjectsLens, state).asArray().reduce((s, id) =>
					R.over(
						L.lensForObjectAtID(id),
						moveObject(action.parameters.displacement),
						s),
					state)

			const resetDragAmount = R.set(L.dragAmountLens, M.Vector.zero);

			return R.compose(moveAllObjects, resetDragAmount)(state);


		default:
			return state
	}
}