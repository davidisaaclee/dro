import { connect } from 'react-redux';
import { Canvas } from '../presentational/Canvas';
import * as Actions from '../../Actions';
import { Vector } from '../../Models';

const mutateObject = (state, objectID, mutator) =>
  state.objects[objectID] == null
    ? state
    : Object.assign(
        {},
        state,
        {
          objects: Object.assign({}, state.objects, {
            [objectID]: mutator(state.objects[objectID])
          })
        })

const objectSetToObjectTree = (objectSet, rootID = "root") => {
  // TODO: Remove objects as they are parsed, to disallow circular references.
  function unflatten(flatObj) {
    return Object.assign({}, flatObj, {
      children: flatObj.children.map((childID) => unflatten(objectSet[childID]))
    });
  }

  return unflatten(objectSet[rootID]);
};

const applyDrag = (state) => {
  let { selectedObjects, dragAmount, objects } = state;

  if (dragAmount == null) {
    return state;
  }

  return Object.assign({}, state, {
    objects: selectedObjects
      .asArray()
      .reduce(applyDragToObject, objects)
  });

  function applyDragToObject(objects, draggedObjectID) {
    if (objects[draggedObjectID] != null) {
      let draggedObject = objects[draggedObjectID];

      return Object.assign({}, objects, {
        [draggedObjectID]: Object.assign({}, draggedObject, {
          origin: Vector.sum(draggedObject.origin, dragAmount)
        })
      });
    } else {
      return objects;
    }
  }
};

function applySelection(state) {
  return state.selectedObjects.asArray().reduce(function (state, id) {
    return mutateObject(state, id, (obj) => Object.assign({}, obj, {
      selected: true
    }));
  }, state);
}

function mapStateToProps(state) {
  let preparedState = applySelection(applyDrag(state));

  return {
    root: objectSetToObjectTree(preparedState.objects)
  };
}

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