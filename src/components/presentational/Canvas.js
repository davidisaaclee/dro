import * as R from 'react';
import { GraphicObjectView } from './GraphicObjectView';
import { Vector } from '../../Models';

export class Canvas extends R.Component {
	constructor(props) {
		super(props);

		// Setup initial state.
		this.state = {
			isDragging: false,
			dragDisplacement: null,
			draggedObject: null
		};

		// Bind methods to `this`.
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
	}

  render() {
    return R.DOM.div({
			style: {
				width: "100%",
				height: "100%",
			},
			onMouseDown: this.handleMouseDown,
			onMouseUp: this.handleMouseUp,
			onMouseMove: this.handleMouseMove,
    },
      R.createElement(GraphicObjectView, {
        object: this.props.root,
        id: "root"
      })
    );
  }


  // Event handlers

  handleMouseDown(event) {
		this.setState({
			isDragging: true,
			initialDragPoint: { x: event.clientX, y: event.clientY }
		});

		this.props.objectWasPickedUp("o1");
  }

  handleMouseUp(event) {
		let dragAmount = {
			x: event.clientX - this.state.initialDragPoint.x,
			y: event.clientY - this.state.initialDragPoint.y
		};

		// Below a threshold, treat this as a click.
		if (Vector.magnitude(dragAmount) < 20) {
			// * clicky *
		} else {
			this.props.objectWasDropped(dragAmount);
		}

		this.setState({
			isDragging: false,
			initialDragPoint: null
		});
  }

  handleMouseMove(event) {
		if (!this.state.isDragging) {
			return;
		}

		let dragAmount = {
			x: event.clientX - this.state.initialDragPoint.x,
			y: event.clientY - this.state.initialDragPoint.y
		};
		this.props.objectWasDragged(dragAmount);
  }
}