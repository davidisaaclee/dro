function makeAction(actionType, parameters) {
	return {
		type: actionType,
		parameters: parameters
	};
}

export const Types = {
	AddRectangle: "AddRectangle",
	DragSelectedObjects: "DragSelectedObjects",
	SelectObjects: "SelectObjects",
	ToggleSelectObjects: "ToggleSelectObjects",
	MoveSelectedObjects: "MoveSelectedObjects",
};

export const AddRectangle = (origin, parent) =>
	makeAction(Types.AddRectangle, { origin, parent })

export const DragSelectedObjects = (displacement) =>
	makeAction(Types.DragSelectedObjects, { displacement })

export const SelectObjects = (objectIDs, extendSelection) =>
	makeAction(Types.SelectObjects, { objectIDs, extendSelection })

export const ToggleSelectObjects = (objectIDs, extendSelection) =>
	makeAction(Types.ToggleSelectObjects, { objectIDs, extendSelection })

export const MoveSelectedObjects = (displacement) =>
	makeAction(Types.MoveSelectedObjects, { displacement })