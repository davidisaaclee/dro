import * as R from 'react';
import { Canvas } from '../presentational/Canvas';

export class Application extends R.Component {
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    let objectID = objectIDFromKeyCode(event.keyCode);
    if (objectID === null) {
      return
    }

    this._select(objectID);
  }

  handleKeyUp() {
    var objectID = objectIDFromKeyCode(event.keyCode);
    if (objectID === null) {
      return
    }

    this._deselect();
  }

  handleMouseMove(event) {
    console.log("mouse move");
  }

  _select(idOrNull) {
    if (idOrNull === null) {
      return this.deselect();
    } else {
      console.log("Selected", idOrNull);
      document.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  _deselect() {
    console.log("Deselected");
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  render() {
    return R.DOM.div(null,
      R.createElement(Canvas, this.props)
    );
  }
}



function objectIDFromKeyCode(keyCode) {
  function isNumberKeyCode(keyCode) {
    return (keyCode >= 48) && (keyCode <= 57);
  }

  if (isNumberKeyCode(keyCode)) {
    var number = keyCode - 48;
    return number;
  } else {
    return null;
  }
}