import * as R from 'react';
import { GraphicObjectView } from './GraphicObjectView';

export class Canvas extends R.Component {
  render() {
    return R.DOM.div(null,
      R.createElement(GraphicObjectView, {
        object: this.props.root,
        keyString: "root"
      })
    );
  }
}