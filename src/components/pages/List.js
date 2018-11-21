import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

class List extends React.Component {

    state = {
        id: null,
        text: '',
        listId: null
    }
    
    render() {
        const cards = this.props.cards;
        const cardList = cards.filter((card) => {
            if (card.listId === this.props.list.listId) {
                return card;
            }
        });

        const a = cardList.map((card) =>
            <div className="list-group-item" key={card.id}><Card card={card} /></div>
        );

        return (
            <div className="list-group">
                {a}
            </div>
        )
    }
}

List.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
    list: PropTypes.instanceOf(Object).isRequired
}

export default List;