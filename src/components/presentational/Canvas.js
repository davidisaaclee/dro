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
		this.handleMouseOverObject = this.handleMouseOverObject.bind(this);
		this.handleMouseLeftObject = this.handleMouseLeftObject.bind(this);
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
        id: this.props.root.id,
        path: [this.props.root.id],
        hoveredObjectPath: this.state.hoveredObject,
        mouseOverObject: this.handleMouseOverObject,
        mouseLeftObject: this.handleMouseLeftObject,
      })
    );
  }

  // componentWillUpdate(nextProps, nextState) {
		// console.log(nextState);
  // }


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
		let location = Vector(event.clientX, event.clientY);
		if (this.state.isDragging) {
			this.dragTo(location);
		}
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