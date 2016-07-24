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
        hoveredObjectPath: this.state.hoveredObject,
        mouseOverObject: this.handleMouseOverObject,
        mouseLeftObject: this.handleMouseLeftObject,
      })
    );
  }

  // Event handlers

  handleMouseDown(event) {
		if (this.state.hoveredObject == null) {
			return;
		}

		let hoveredObjectID = R.last(this.state.hoveredObject);
		if (hoveredObjectID != null) {
			this.props.objectWasPickedUp(hoveredObjectID, this.state.isExtendingSelection);
		}

		this.setState({
			isDragging: true,
			initialDragPoint: { x: event.clientX, y: event.clientY }
		});
  }

  handleMouseUp(event) {
		if (!this.state.isDragging) {
			return;
		}

		let dragAmount = {
			x: event.clientX - this.state.initialDragPoint.x,
			y: event.clientY - this.state.initialDragPoint.y
		};

		// Below a threshold, treat this as a click.
		if (Vector.magnitude(dragAmount) < 1) {
			let hoveredObjectID = R.last(this.state.hoveredObject);
			if (hoveredObjectID != null) {
				this.props.objectWasSelected(hoveredObjectID, this.state.isExtendingSelection);
			} else {
				this.props.objectWasDeselected(hoveredObjectID, this.state.isExtendingSelection);
			}
		} else {
			this.props.objectWasDropped(dragAmount, this.state.isExtendingSelection);
		}

		this.setState({
			isDragging: false,
			initialDragPoint: null
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
		let dragAmount = {
			x: location.x - this.state.initialDragPoint.x,
			y: location.y - this.state.initialDragPoint.y
		};

		this.props.objectWasDragged(dragAmount);
  }

  handleMouseOverObject(path, event) {
		this.setState({
			hoveredObject: path
		})
  }

	handleMouseLeftObject(path, event) {
		this.setState({
			hoveredObject: null
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

  // detectObjectHoverFor(event) {
		// const elementIsGraphicObjectView = (element) =>
		//	element.classList.contains("gov")

		// if (elementIsGraphicObjectView(event.target)) {
		//	this.setState({
		//		hoveredObject: event.target.id
		//	});
		// } else {
		//	this.setState({
		//		hoveredObject: null
		//	});
		// }
  // }
}