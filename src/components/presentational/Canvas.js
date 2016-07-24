import * as React from 'react';
import * as R from 'ramda';
import { GraphicObjectView } from './GraphicObjectView';
import { Vector } from '../../Models';

export class Canvas extends React.Component {
	constructor(props) {
		super(props);

		// Setup initial state.
		this.state = {
			isDragging: false,
			isExtendingSelection: false,
			hoveredObjectPath: null,
			interactionObjectID: null,
			initialDragPoint: null,
			mouseLocation: null,
		};

		// Bind methods to `this`.
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOverObject = this.handleMouseOverObject.bind(this);
		this.handleMouseLeftObject = this.handleMouseLeftObject.bind(this);

		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		window.addEventListener("keypress", this.handleKeyPress);
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

  render() {
    return React.DOM.div({
			style: {
				width: "100%",
				height: "100%",
				overflow: "hidden"
			},
			onMouseDown: this.handleMouseDown,
			onMouseUp: this.handleMouseUp,
			onMouseMove: this.handleMouseMove,
			onKeyPress: this.handleKeyPress,
    },
      React.createElement(GraphicObjectView, {
        object: this.props.root,
        id: this.props.root.id,
        path: [this.props.root.id],
        hoveredObjectPath: this.state.hoveredObjectPath,

        mouseOverObject: this.handleMouseOverObject,
        mouseLeftObject: this.handleMouseLeftObject,
      })
    );
  }

  // Event handlers

  handleMouseDown(event) {
		if (this.state.hoveredObjectPath == null) {
			return;
		}

		this.setState({
			isDragging: true,
			initialDragPoint: Vector(event.clientX, event.clientY),
			interactionObjectID: R.last(this.state.hoveredObjectPath)
		});
  }

  handleMouseUp(event) {
		if (!this.state.isDragging) {
			return;
		}

		let location = Vector(event.clientX, event.clientY);
		let displacement = Vector.difference(location, this.state.initialDragPoint);

		// Below a threshold, treat this as a click.
		if (Vector.magnitude(displacement) < 1) {
			this.objectWasSelected(this.state.interactionObjectID);
		} else {
			this.objectWasDragged(this.state.interactionObjectID, displacement);
		}

		this.setState({
			isDragging: false,
			initialDragPoint: null,
			interactionObjectID: null,
		});
  }

  handleMouseMove(event) {
		let location = Vector(event.clientX, event.clientY);
		if (this.state.isDragging) {
			this.dragTo(location);
		}

		this.setState({
			mouseLocation: location
		});
  }

  dragTo(location) {
		if (this.state.interactionObjectID == null) {
			return;
		}

		let displacement = Vector.difference(location, this.state.initialDragPoint);
		this.props.selectObject(this.state.interactionObjectID, this.state.isExtendingSelection);
		this.props.dragSelectedObjects(displacement);
  }

  handleMouseOverObject(path, event) {
		this.setState({
			hoveredObjectPath: path
		})
  }

	handleMouseLeftObject(path, event) {
		this.setState({
			hoveredObjectPath: null
		})
  }

  handleKeyPress(event) {
		switch (event.key) {
			case 'r':
				if (this.state.mouseLocation == null) {
					return;
				}

				this.props.addRectangleAt(this.state.mouseLocation, "root");
		}
  }

  handleKeyDown(event) {
		switch (event.key) {
			case "Shift":
				this.setState({
					isExtendingSelection: true
				});
		}
  }

  handleKeyUp(event) {
		switch (event.key) {
			case "Shift":
				this.setState({
					isExtendingSelection: false
				});
		}
  }

  objectWasDragged(objectID, displacement) {
		this.props.selectObject(objectID, this.state.isExtendingSelection);
		this.props.moveSelectedObjects(displacement);
  }

	objectWasSelected(objectID) {
		if (this.state.isExtendingSelection) {
			this.props.toggleObjectSelection(objectID, true);
		} else {
			this.props.selectObject(objectID, false);
		}
	}
}