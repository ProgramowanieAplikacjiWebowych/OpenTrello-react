import React from 'react';
import Card from './Card';

class List extends React.Component {

    // constructor (props) {
    //     super(props);
    // }

    state = {
        id: null,
        text: '',
        listId: null
    }

    componentDidMount() {
        console.log('@@@dupa', this.props, this.state);
    }

    render() {
        const cards = this.props.cards;
        const cardList = cards.filter((card) => {
            if (card.listId === this.props.list.listId) {
                return card
            }
        });
        console.log('aaaa ', cardList);
        let a = cardList.map((card) =>
            <li  className="list-group-item"  key={card.id}><Card card={card}></Card></li>
        );
        console.log('aaadupa ', a);

        return (
            <ul className="list-group" style={{ border: '1px solid pink' }}>
                {a}
            </ul>
        )
    }
}

export default List;