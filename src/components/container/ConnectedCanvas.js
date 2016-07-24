import * as R from 'ramda';
import { connect } from 'react-redux';
import { Canvas } from '../presentational/Canvas';
import * as Actions from '../../Actions';
import { Vector } from '../../Models';
import * as L from '../../Lenses';

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

  if (state.dragAmount == null) {
    return state;
  }

  function applyDragToObjectID(objects, draggedObjectID) {
    if (objects[draggedObjectID] == null) {
      return objects;
    }

    return R.over(
      R.lensPath([draggedObjectID, 'origin']),
      R.curry(Vector.sum)(dragAmount),
      objects);
  }

  return Object.assign({}, state, {
    objects: state.selectedObjects
      .asArray()
      .reduce(applyDragToObjectID, state.objects)
  });
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

  }
};

export let ConnectedCanvas = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);