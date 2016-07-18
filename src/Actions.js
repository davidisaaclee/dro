function makeAction(actionType, parameters) {
	return {
		type: actionType,
		parameters: parameters
	};
}

export const Types = {
	AddRectangle: "AddRectangle"
};

export const AddRectangle =
	(parent) => makeAction(Types.AddRectangle, { parent });