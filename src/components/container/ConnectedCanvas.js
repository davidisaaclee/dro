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

const applyDrag = (draggedObjectIDs, dragAmount, objectSet) => {
  if (dragAmount == null) {
    return objectSet;
  }

  return draggedObjectIDs
    .asArray()
    .reduce(applyDragToObject, objectSet);

  function applyDragToObject(objectSet, draggedObjectID) {
    if (objectSet[draggedObjectID] != null) {
      let draggedObject = objectSet[draggedObjectID];

      return Object.assign({}, objectSet, {
        [draggedObjectID]: Object.assign({}, draggedObject, {
          origin: Vector.sum(draggedObject.origin, dragAmount)
        })
      });
    } else {
      return objectSet;
    }
  }
};

const mapStateToProps = (state) => {
  return {
    root: objectSetToObjectTree(
      applyDrag(
        state.selectedObjects,
        state.dragAmount,
        state.objects),
      "root")
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    objectWasPickedUp: (objectID, extendSelection) =>
      dispatch(Actions.PickupObject(objectID, extendSelection)),

    objectWasDragged: (objectID, dragAmount) =>
      dispatch(Actions.DragObject(objectID, dragAmount)),

    objectWasDropped: (displacement, extendSelection) =>
      dispatch(Actions.DropObject(displacement, extendSelection)),

    objectWasSelected: (objectID, extendSelection) =>
      dispatch(Actions.SelectObjects([objectID], extendSelection)),

    objectWasDeselected: (objectID, extendSelection) =>
      dispatch(Actions.SelectObjects([], extendSelection)),

    addRectangleAt: (origin, parentID) =>
      dispatch(Actions.AddRectangle(origin, parentID)),
  }
};

export let ConnectedCanvas = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);