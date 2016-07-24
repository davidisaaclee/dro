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

const insertObject = (state, object, parentID) => {
	let id = `object-${state.objectCounter}`;

	let stateWithNewObject = Object.assign({}, state,
		{ objectCounter: state.objectCounter + 1 },
		{
			objects: Object.assign({}, state.objects, {
				[id]: Object.assign({}, object, { id: id })
			})
		});


	let stateWithUpdatedParent = mutateObject(stateWithNewObject, parentID, (parent) => {
		return Object.assign({}, parent, { children: parent.children.concat([id]) });
	});

	return stateWithUpdatedParent;
}

function mutateObjectInObjectSet(objectSet, objectID, mutator) {
	return Object.assign({}, objectSet, {
		[objectID]: mutator(objectSet[objectID])
	});
}

const mutateObject = (state, objectID, mutator) =>
	state.objects[objectID] == null
		? state
		: Object.assign({}, state, {
				objects: mutateObjectInObjectSet(state.objects, objectID, mutator)
			})

const nullifyDrag = (state) =>
	Object.assign({}, state, {
		dragAmount: null
	})

function updateSelection(previousSelectedObjects, objectIDs, extendSelection) {
	if (extendSelection) {
		return objectIDs.reduce(
			(acc, elm) => acc.insert(elm),
			previousSelectedObjects);
	} else {
		return new Set(objectIDs);
	}
}


export function reduce(state = initialState, action) {
	switch (action.type) {
		case Actions.Types.AddRectangle:
			return insertObject(
				state,
				makeRectangle(action.parameters.origin),
				action.parameters.parent);


		case Actions.Types.PickupObject:
			return Object.assign({},
				state,
				{
					dragAmount: M.Vector.zero,
					selectedObjects: updateSelection(
						state.selectedObjects,
						[action.parameters.objectID],
						action.parameters.extendSelection)
				});


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
				mutateObject(previousState, objectID, (object) =>
					Object.assign({}, object, {
						origin: M.Vector.sum(object.origin, action.parameters.displacement)
					}))

			const deselectIfNeeded = (state) =>
				Object.assign({}, state, {
					selectedObjects: updateSelection(
						state.selectedObjects,
						[],
						action.parameters.extendSelection)
				})

			return state.selectedObjects
				.asArray()
				.reduce(
					dropObject,
					deselectIfNeeded(nullifyDrag(state)));


		case Actions.Types.SelectObjects:
			return Object.assign({}, state, {
				selectedObjects: updateSelection(
					state.selectedObjects,
					action.parameters.objectIDs,
					action.parameters.extendSelection)
			});


		default:
			return state
	}
}