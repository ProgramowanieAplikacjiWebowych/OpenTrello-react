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
            <div draggable 
                onDragStart={(e) => this.onDragStart(e, this.props.card)} 
                style={{ border: '1px solid black',
                        display: "inline-block",
                        width: "100%",
                        height: "40px",
                        textAlign: "WebkitCenter",
                        lineHeight: "2.5em"
                    }}>

                {this.props.card.text}
            </div>
        )
    }
}

Card.propTypes = {
    card: PropTypes.instanceOf(Object).isRequired,
    updateCards: PropTypes.func
}

const mapDispatchToState = dispatch => {
    return {
        updateCards: card => dispatch(cardMoved(card)),
    }
};

const mapStateToProps = (state) => {
    console.log('card mapStateToProps', state);
    return {
        cards: state.board.cards,
        lists: state.board.lists
    };
};

export default connect(mapStateToProps, mapDispatchToState)(Card);
