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
};

export const AddRectangle =
	(parent) => makeAction(Types.AddRectangle, { parent });

export const PickupObject =
	(objectID) => makeAction(Types.PickupObject, { objectID });

export const DragObject =
	(dragAmount) => makeAction(Types.DragObject, { dragAmount });

export const DropObject =
	(displacement) => makeAction(Types.DropObject, { displacement });