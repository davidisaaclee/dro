function setFromObj(obj) {
	let set = new Set();
	set._impl = obj;
	return set;
}

export class Set {
	constructor(values = []) {
		this._impl = values.reduce((acc, elm) => {
			acc[elm] = true;
			return acc;
		}, {});
	}

	contains(value) {
		return Set.contains(this, value);
	}

	remove(value) {
		return Set.remove(this, value);
	}

	insert(value) {
		return Set.insert(this, value);
	}

	asArray() {
		return Object.keys(this._impl);
	}
}

Object.assign(Set, {
	insert: (set, value) =>
		setFromObj(Object.assign({}, set._impl, {
			[value]: true
		})),

	contains: (set, value) =>
		set._impl[value] === true,

	remove: (set, value) => {
		let removed = Object.assign({}, set._impl);
		delete removed[value];
		return setFromObj(removed);
	},

	// If `value` is not already a member of `set`, inserts `value` into `set`.
	// If `value` is already a member of `set`, remove `value` from `set`.
	toggle: (set, value) => {
		console.log("Toggling ", value, "in", set.asArray());
		return set.contains(value)
			? set.remove(value)
			: set.insert(value)
	}
})