import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { reduce } from './Reducer';
import { ConnectedApplication } from './components/container/ConnectedApplication';

const renderWithStore = (store) =>
  ReactDOM.render(
    createApplication(store),
    document.getElementById('container'))

const createApplication = (store) =>
  React.createElement(
      Provider,
      { store },
      React.createElement(ConnectedApplication))

const makeStore = () => createStore(reduce)

export const start = () => renderWithStore(makeStore())