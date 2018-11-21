import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { cardMoved } from '../../actions/board';

class Card extends React.Component {

    state = {
        card: {}
    }

    componentWillMount() {
        this.setState({ card: this.props.card });
    }

    onDragStart = (ev, element) => {
        console.log('Drag start', element);
        ev.dataTransfer.setData('card', JSON.stringify(element));
    }

    render() {
        return (
            <div onDragStart={(e) => this.onDragStart(e, this.props.card)} draggable style={{ border: '1px solid black' }}>{this.props.card.text}</div>
        )
    }
}

Card.propTypes = {
    card: PropTypes.instanceOf(Object).isRequired,
    updateCards: PropTypes.func
}

const mapDispatchToState = dispatch => {
    return {
        updateCards: card => dispatch(cardMoved(card))
    }
}

export default connect(null, mapDispatchToState)(Card);
