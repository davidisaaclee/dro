import * as M from "./Models";
import * as Actions from "./Actions";
import { Vector } from './Models';

const initialState = {
	objectCounter: 0,
	objects: {
	  root: M.GraphicObject({
			id: 'root',
			origin: M.Vector(0, 0),
			children: ['o1', 'o2']
		}),
	  o1: M.Rectangle({
			id: 'o1',
			origin: M.Vector(500, 100),
			children: [],
			size: M.Vector(100, 100)
		}),
	  o2: M.Rectangle({
			id: 'o2',
			origin: M.Vector(800, 100),
			children: ['o3'],
			size: M.Vector(30, 400)
		}),
	  o3: M.Rectangle({
			id: 'o3',
			origin: M.Vector(100, 200),
			children: ['o4', 'o5'],
			size: M.Vector(100, 100)
		}),
	  o4: M.Rectangle({
			id: 'o4',
			origin: M.Vector(400, 300),
			children: [],
			size: M.Vector(100, 100)
		}),
	  o5: M.Rectangle({
			id: 'o5',
			origin: M.Vector(200, 400),
			children: [],
			size: M.Vector(100, 100)
		}),
	},
	draggedObject: null
};

function makeRectangle(parentID) {
	return {
		type: "Rectangle",
		origin: new Model.Vector(50, 50),
		size: new Model.Vector(100, 200)
	}
}

const insertObject = (state, object) => {
	let id = `object-${state.objectCounter}`;

	console.log("id", id);

	return Object.assign({}, state,
		{ objectCounter: state.objectCounter + 1 },
		{
			objects: Object.assign({}, state.objects, {
				[id]: Object.assign({}, object, { id: id })
			})
		})
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
	Object.assign({}, state, { draggedObject: null })


export function reduce(state = initialState, action) {
	switch (action.type) {
		case Actions.Types.AddRectangle:
			return insertObject(state, makeRectangle(action.parameters.parent))


		case Actions.Types.PickupObject:
			return Object.assign({},
				state,
				{
					draggedObject: Object.assign({}, state.draggedObject, {
						objectID: action.parameters.objectID,
						dragAmount: Vector(0, 0)
					})
				});


		case Actions.Types.DragObject:
			if (state.draggedObject == null) {
				return state;
			}

			return Object.assign({}, state, {
				draggedObject: Object.assign({}, state.draggedObject, {
					dragAmount: action.parameters.dragAmount
				})
			});


		case Actions.Types.DropObject:
			if (state.draggedObject == null) {
				return state;
			}

			return mutateObject(nullifyDrag(state), state.draggedObject.objectID, (object) =>
				Object.assign({}, object, {
					origin: Vector.sum(object.origin, action.parameters.displacement)
				}))


		default:
			return state
	}
}