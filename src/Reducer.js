import * as M from "./Models";
import * as Actions from "./Actions";

const initialState = {
	objectCounter: 0,
	objects: {
	  root: M.GraphicObject({
			origin: M.Vector(0, 0),
			children: ['o1', 'o2']
		}),
	  o1: M.Rectangle({
			origin: M.Vector(500, 100),
			children: [],
			size: M.Vector(100, 100)
		}),
	  o2: M.Rectangle({
			origin: M.Vector(800, 100),
			children: ['o3'],
			size: M.Vector(30, 400)
		}),
	  o3: M.Rectangle({
			origin: M.Vector(100, 200),
			children: ['o4', 'o5'],
			size: M.Vector(100, 100)
		}),
	  o4: M.Rectangle({
			origin: M.Vector(400, 300),
			children: [],
			size: M.Vector(100, 100)
		}),
	  o5: M.Rectangle({
			origin: M.Vector(200, 400),
			children: [],
			size: M.Vector(100, 100)
		}),
	}
};

function makeRectangle(parentID) {
	return {
		type: "Rectangle",
		origin: new Model.Vector(50, 50),
		size: new Model.Vector(100, 200)
	}
}

const insertObject = (state, object) =>
		Object.assign({},
			state,
			{ objectCounter: state.objectCounter + 1 },
			{ objects: Object.assign(
					{},
					state.objects,
					{ [`object-${state.objectCounter}`]: object })
		})

export function reduce(state = initialState, action) {
	switch (action.type) {
		case Actions.Types.AddRectangle:
			return insertObject(state, makeRectangle(action.parameters.parent))

		default:
			return state
	}
}