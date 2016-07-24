import { Application } from './Application';
import { connect } from 'react-redux';

const objectSetToObjectTree = (objectSet, rootID) => {
  // TODO: Remove objects as they are parsed, to disallow circular references.
  function unflatten(flatObj) {
    return Object.assign({}, flatObj, {
      children: flatObj.children.map((childID) => unflatten(objectSet[childID]))
    });
  }

  return unflatten(objectSet[rootID]);
};

const mapStateToProps = (state) => {
  return {
    root: objectSetToObjectTree(state.objects, "root")
  };
};

export let ConnectedApplication = connect(mapStateToProps)(Application);