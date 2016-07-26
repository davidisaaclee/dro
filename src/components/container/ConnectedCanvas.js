import * as R from 'ramda';
import { connect } from 'react-redux';
import { Canvas } from '../presentational/Canvas';
import * as Actions from '../../Actions';
import { Vector } from '../../Models';
import * as L from '../../Lenses';

const mutateObject = (state, objectID, mutator) =>
  R.over(L.lensForObjectAtID(objectID), mutator, state)

const objectSetToObjectTree = (objectSet, rootID = "root") => {
  // TODO: Remove objects as they are parsed, to disallow circular references.
  const unflatten =
    R.over(
      R.lensProp('children'),
      R.map((childID) => unflatten(objectSet[childID])))

  return unflatten(objectSet[rootID]);
};

const applyDrag = (state) => {
  if (R.view(L.dragAmountLens, state) == null) {
    return state;
  }

  function applyDragToObjectID(objects, draggedObjectID) {
    if (objects[draggedObjectID] == null) {
      return objects;
    }

    return R.over(
      R.lensPath([draggedObjectID, 'origin']),
      R.curry(Vector.sum)(R.view(L.dragAmountLens, state)),
      objects);
  }

  const addSelection = (selectedObjectIDs) => (objects) =>
    selectedObjectIDs.reduce(applyDragToObjectID, objects)

  const selectedObjectIDs = R.view(L.selectedObjectsLens, state).asArray()

  return R.over(L.objectSetLens, addSelection(selectedObjectIDs), state)
};

function applySelection(state) {
  return R.view(L.selectedObjectsLens, state)
    .asArray()
    .reduce(function (state, id) {
      return mutateObject(state, id, (obj) => Object.assign({}, obj, {
        selected: true
      }));
    }, state);
}

function mapStateToProps(state) {
  let preparedState = applySelection(applyDrag(state));

  return {
    root: objectSetToObjectTree(R.view(L.objectSetLens, preparedState))
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dragSelectedObjects: (displacement) =>
      dispatch(Actions.DragSelectedObjects(displacement)),

    addRectangleAt: (origin, parentID) =>
      dispatch(Actions.AddRectangle(origin, parentID)),

    selectObject: (objectID, extendSelection) =>
      dispatch(Actions.SelectObjects([objectID], extendSelection)),

    toggleObjectSelection: (objectID, extendSelection) =>
      dispatch(Actions.ToggleSelectObjects([objectID], extendSelection)),

    moveSelectedObjects: (displacement) =>
      dispatch(Actions.MoveSelectedObjects(displacement)),

    softReplaceObjectSelection: (objectID) =>
      dispatch(Actions.SoftReplaceObjectSelection(objectID)),

  }
};

export let ConnectedCanvas = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);