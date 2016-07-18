import * as Model from "./Models";

import * as Actions from "./Actions";

// const initialState = new Model.Artboard({
//   rootObject: new Model.Group({
//     origin: new Model.Vector(150, 140),
//     children: [
//       new Model.Rectangle({
//         origin: new Model.Vector(50, 100),
//         size: new Model.Vector(50, 50)
//       }),
//       new Model.Rectangle({
//         origin: new Model.Vector(200, 100),
//         size: new Model.Vector(50, 50)
//       }),
//     ]
//   })
// });

// const initialState = {
//	objectCounter: 0,
//	objects: {
//		root: { children: [] }
//	}
// }

const initialState = {
	objectCounter: 0,
	objects: {
	  root: {
	    children: ['o1', 'o2'],
	    origin: { x: 0, y: 0 },
	  },
	  o1: {
	    children: ['o3'],
	    origin: { x: 500, y: 100 },
	    type: "Rectangle",
	    size: { x: 100, y: 100 },
	  },
	  o2: {
	    children: ['o4', 'o5'],
	    origin: { x: 100, y: 200 },
	    type: "Rectangle",
	    size: { x: 100, y: 100 },
	  },
	  o3: {
	    children: [],
	    origin: { x: 400, y: 300 },
	    type: "Rectangle",
	    size: { x: 100, y: 100 },
	  },
	  o4: {
	    children: [],
	    origin: { x: 200, y: 400 },
	    type: "Rectangle",
	    size: { x: 100, y: 100 },
	  },
	  o5: {
	    children: [],
	    origin: { x: 300, y: 500 },
	    type: "Rectangle",
	    size: { x: 100, y: 100 },
	  },
	}
};


function makeRectangle(parentID) {
	return {
		type: "Rectangle",
		origin: new Model.Vector(50, 50),
		size: new Model.Vector(100, 200)
	}
}


export function reduce(state = initialState, action) {
	switch (action.type) {
		case Actions.Types.AddRectangle:
			let rect = makeRectangle(action.parameters.parent);
			return Object.assign(
				{},
				state,
				{
					objectCounter: state.objectCounter + 1
				},
				{
					objects: Object.assign({}, state.objects, {
						[`object-${state.objectCounter}`]: rect
					})
				}
			);

		default:
			return state;
	}
}