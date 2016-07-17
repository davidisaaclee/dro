import * as _ from 'lodash';

// --- Model --- //

export class Artboard {
  constructor({ rootObject }) {
    this.rootObject = rootObject;
  }
}

export class GraphicObject {
  constructor({ children = [], origin = new Vector(0, 0) }) {
    this.children = children;
    this.origin = origin;
  }

  makeStyle() {
    return {};
  }
}

export class Group extends GraphicObject {
  constructor({ children = [], origin = new Vector(0, 0) }) {
    super({ children, origin });
  }
}

export class Rectangle extends GraphicObject {
  constructor({ children = [], origin = new Vector(0, 0),
                size = new Vector(0, 0) }) {
    super({ children, origin });

    this.size = size;
  }

  makeStyle() {
    return _.extend(super.makeStyle(), {
      width: this.size.x + "px",
      height: this.size.y + "px",
    });
  }
}

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}