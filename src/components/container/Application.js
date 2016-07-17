import * as R from 'react';
import { Canvas } from '../presentational/Canvas';

export class Application extends R.Component {
  render() {
    return R.DOM.div(null,
      R.createElement(Canvas, this.props.model)
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