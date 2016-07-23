function setFromObj(obj) {
	let set = new Set();
	set._impl = obj;
	console.log('1', set, set.asArray());
	return set;
}

export class Set {
	constructor(...values) {
		this._impl = values.reduce((acc, elm) => {
			acc[elm] = true;
			return acc;
		}, {})
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
		console.log("inserting", value, "into", this._impl);
		let insertedImpl = Object.assign({}, this._impl, {
			[value]: true
		});
		console.log("Inserted", insertedImpl);

		return setFromObj(insertedImpl);
	}

	asArray() {
		return Object.keys(this._impl);
	}
}