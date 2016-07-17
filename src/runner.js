import * as Model from "./models";

var initialModel = new Model.Artboard({
  rootObject: new Model.Group({
    origin: new Model.Vector(150, 140),
    children: [
      new Model.Rectangle({
        origin: new Model.Vector(50, 100),
        size: new Model.Vector(50, 50)
      }),
      new Model.Rectangle({
        origin: new Model.Vector(200, 100),
        size: new Model.Vector(50, 50)
      }),
    ]
  })
});


// (Model, Input) -> Model
// function reduce(model, input) {
//   if (input.action == "ChangeSelection") {
//     model.selection = input.selection;
//   }
//   return model;
// }

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Application } from './components/container/Application';

let ApplicationFactory = React.createFactory(Application);

function renderWithModel(model) {
  ReactDOM.render(
    ApplicationFactory({ model: model }),
    document.getElementById('container')
  );
}

export function start() {
  renderWithModel(initialModel);
};