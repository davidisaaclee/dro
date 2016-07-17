import * as R from 'react';

export class GraphicObjectView extends R.Component {
  render() {
    return R.DOM.div({
      style: _.extend({
        left: this.props.object.origin.x + "px",
        top: this.props.object.origin.y + "px",
        position: "absolute",
        backgroundColor: "#ccc",
      }, this.props.object.makeStyle()),
    }, this.props.object.children.map((child, index) => {
      var key = this.props.id + "-" + index
      return R.createElement(GraphicObjectView, {
        object: child,
        id: key,
        key: key
      });
    }))
  }
}