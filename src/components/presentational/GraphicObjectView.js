import * as R from 'react';
import { Vector } from '../../Models';

export class GraphicObjectView extends R.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseDownPoint: null
    };

    // Bind methods to `this`.
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  render() {
    return R.DOM.div({
      id: this.props.path.join('-'),

      className: this._getClassList().join(" "),

      onMouseOver: this.handleMouseOver,
      onMouseLeave: this.handleMouseLeave,

      style: Object.assign({
        left: `${this.props.object.origin.x}px`,
        top: `${this.props.object.origin.y}px`,
      }, this.makeStyleFor(this.props.object)),
    }, this.props.object.children.map((child, index) => {
      let path = this.props.path.concat(child.id);
      return R.createElement(GraphicObjectView, {
        object: child,
        id: child.id,
        path: path,
        key: path.join("-"),

        mouseOverObject: this.props.mouseOverObject,
        mouseLeftObject: this.props.mouseLeftObject,
      });
    }),
    R.DOM.span({
      className: "knob"
    }))
  }

  isSelected() {
    return this.props.object.selected;
  }

  _getClassList() {
    let result = ["gov"];
    result.push(this.props.object.type);
    if (this.isSelected()) {
      result.push("selected");
    }
    return result;
  }

  makeStyleFor(obj) {
    const shapeStyle = () => {
      switch (obj.type) {
        case "Rectangle":
          return {
            width: `${obj.size.x}px`,
            height: `${obj.size.y}px`,
          };

        default:
          return {};
      }
    }

    return Object.assign({}, shapeStyle());
  }

  handleMouseOver(event) {
    event.stopPropagation();
    if (this.props.mouseOverObject != null) {
      this.props.mouseOverObject(this.props.path, event);
    }
  }

  handleMouseLeave(event) {
    event.stopPropagation();
    if (this.props.mouseLeftObject != null) {
      this.props.mouseLeftObject(this.props.path, event);
    }
  }
}