function makeAction(actionType, parameters) {
	return {
		type: actionType,
		parameters: parameters
	};
}

export const Types = {
	AddRectangle: "AddRectangle",
	DragObject: "DragObject",
	DropObject: "DropObject",
	PickupObject: "PickupObject",
	SelectObjects: "SelectObjects",
};

export const AddRectangle = (origin, parent) =>
	makeAction(Types.AddRectangle, { origin, parent })

export const PickupObject = (objectID, extendSelection) =>
	makeAction(Types.PickupObject, { objectID, extendSelection })

export const DragObject = (dragAmount) =>
	makeAction(Types.DragObject, { dragAmount })

export const DropObject = (displacement, extendSelection) =>
	makeAction(Types.DropObject, { displacement, extendSelection })

export const SelectObjects = (objectIDs, extendSelection) =>
	makeAction(Types.SelectObjects, { objectIDs, extendSelection })