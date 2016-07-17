import * as R from 'react';
import { GraphicObjectView } from './GraphicObjectView';

export class Canvas extends R.Component {
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
    document.body.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
    document.body.removeEventListener('keyup', this.handleKeyUp);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedObject === null) {
      document.removeEventListener('mousemove', this.handleMouseMove);
    } else {
      document.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  handleKeyDown(event) {
    var objectID = objectIDFromKeyCode(event.keyCode);
    if (objectID === null) {
      return
    }

    this.setState({
      selectedObject: objectID
    });
  }

  handleKeyUp() {
    var objectID = objectIDFromKeyCode(event.keyCode);
    if (objectID === null) {
      return
    }

    if (objectID === this.state.selectedObject) {
      this.setState({
        selectedObject: null
      });
    }
  }

  handleMouseMove(event) {
    
  }

  render() {
    return R.DOM.div(null,
      R.createElement(GraphicObjectView, {
        object: this.props.rootObject,
        keyString: "root"
      })
    );
  }
}