import { connect } from 'react-redux';
import { Canvas } from '../presentational/Canvas';
import * as Actions from '../../Actions';
import { Vector } from '../../Models';

const objectSetToObjectTree = (objectSet, rootID) => {
  // TODO: Remove objects as they are parsed, to disallow circular references.
  function unflatten(flatObj) {
    return _.extend({}, flatObj, {
      children: flatObj.children.map((childID) => unflatten(objectSet[childID]))
    });
  }

  return unflatten(objectSet[rootID]);
};

const applyDrag = (dragInfo, objectSet) => {
  if (dragInfo == null) {
    return objectSet;
  }

  let draggedObject = objectSet[dragInfo.objectID];

  if (draggedObject != null) {
    return Object.assign({}, objectSet, {
      [dragInfo.objectID]: Object.assign({}, draggedObject, {
        origin: Vector.sum(draggedObject.origin, dragInfo.dragAmount)
      })
    });
  } else {
    return objectSet;
  }
};

const mapStateToProps = (state) => {
  return {
    root: objectSetToObjectTree(applyDrag(state.draggedObject, state.objects), "root")
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    objectWasPickedUp: (objectID) =>
      dispatch(Actions.PickupObject(objectID)),

    objectWasDragged: (objectID, dragAmount) =>
      dispatch(Actions.DragObject(objectID, dragAmount)),

    objectWasDropped: (objectID, displacement) =>
      dispatch(Actions.DropObject(objectID, displacement)),

    addRectangleAt: (origin, parentID) =>
      dispatch(Actions.AddRectangle(origin, parentID)),
  }
};

export let ConnectedCanvas = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);