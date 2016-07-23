import * as M from "./Models";
import * as Actions from "./Actions";
import { Set } from "./utility/Set";

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

const mutateObject = (state, objectID, mutator) =>
	state.objects[objectID] == null
		? state
		: Object.assign(
				{},
				state,
				{
					objects: Object.assign({}, state.objects, {
						[objectID]: mutator(state.objects[objectID])
					})
				})

const nullifyDrag = (state) =>
	Object.assign({}, state, {
		dragAmount: null
	})


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
					selectedObjects: action.parameters.extendSelection
						? state.selectedObjects.insert(action.parameters.objectID)
						: new Set(action.parameters.objectID)
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

			return state.selectedObjects
				.asArray()
				.reduce(dropObject, nullifyDrag(state));


		case Actions.Types.SelectObjects:
			return Object.assign({}, state, {
				selectedObjects: action.parameters.extendSelection
					? action.parameters.objectIDs.reduce(
							(acc, elm) => acc.insert(elm),
							state.selectedObjects)
					: new Set(...action.parameters.objectIDs)
			});


		default:
			return state
	}
}