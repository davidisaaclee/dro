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
		return this._impl[value] === true;
	}

	remove(value) {
		let removed = Object.assign({}, this._impl);
		delete removed[value];
		return setFromObj(removed);
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
		}))
})