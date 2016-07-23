import * as R from 'react';

export class GraphicObjectView extends R.Component {
  constructor(props) {
    super(props);

    // Bind methods to `this`.
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  render() {
    let selectedPath = this._restOfSelectedPath();

    const isChildSelected = (child) => {
      if (selectedPath == null) {
        return false;
      } else {
        return selectedPath[0] == child.id;
      }
    }

    return R.DOM.div({
      id: this.props.path.join('-'),

      onMouseOver: this.handleMouseOver,
      onMouseLeave: this.handleMouseLeave,

      style: _.extend({
        boxSizing: "border-box",
        left: this.props.object.origin.x + "px",
        top: this.props.object.origin.y + "px",
        position: "absolute",
        backgroundColor: "#000",
      }, this.makeStyleFor(this.props.object)),
    }, this.props.object.children.map((child, index) => {
      let path = this.props.path.concat(child.id);

      return R.createElement(GraphicObjectView, {
        object: child,
        id: child.id,
        path: path,
        key: path.join("-"),
        hoveredObjectPath: isChildSelected(child) ? selectedPath : null,

        mouseOverObject: this.props.mouseOverObject,
        mouseLeftObject: this.props.mouseLeftObject,
      });
    }))
  }

  _restOfSelectedPath() {
    if (this.props.hoveredObjectPath == null) {
      return null;
    } else if (this.props.hoveredObjectPath.length == 0) {
      return null;
    } else {
      return this.props.hoveredObjectPath.slice(1);
    }
  }

  isHoveredOver() {
    let rest = this._restOfSelectedPath();

    if (rest == null) {
      return false;
    } else if (rest.length == 0) {
      return true;
    }
  }

  makeStyleFor(obj) {
    const hoverStyle = () => {
      if (this.isHoveredOver()) {
        return {
          outline: "2px solid #f0f"
        };
      } else {
        return {
          outline: "none"
        };
      }
    };

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

    return Object.assign({}, hoverStyle(), shapeStyle());
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