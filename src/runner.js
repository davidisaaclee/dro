import * as Model from "./models";

// var initialModel = new Model.Artboard({
//   rootObject: new Model.Group({
//     origin: new Model.Vector(150, 140),
//     children: [
//       new Model.Rectangle({
//         origin: new Model.Vector(50, 100),
//         size: new Model.Vector(50, 50)
//       }),
//       new Model.Rectangle({
//         origin: new Model.Vector(200, 100),
//         size: new Model.Vector(50, 50)
//       }),
//     ]
//   })
// });

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as Actions from './Actions';
import { reduce } from './Reducer';
import { ConnectedApplication } from './components/container/ConnectedApplication';

function renderWithStore(store) {
  ReactDOM.render(
    React.createElement(
      Provider,
      { store },
      React.createElement(ConnectedApplication)),
    document.getElementById('container')
  );
}

export function start() {
  let store = createStore(reduce);
  renderWithStore(store);
};