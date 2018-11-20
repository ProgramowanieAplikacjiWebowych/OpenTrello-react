import React from 'react';

class Card extends React.Component {

    state = {
        id: null,
        text: ''
    }

    render () {
        return (
            <div style={{ border: '1px solid black'}}>{this.props.card.text}</div>
        )
    }
}

export default Card;