import React from 'react';
import List from './List';

class Board extends React.Component {

    state = {
        id: null,
        text: ''
    }

    // tmp 
    cards = [
        {
            id: 0,
            text: 'Chuj',
            listId: 1
        },
        {
            id: 1,
            text: 'dupa',
            listId: 0
        },{
            id: 2,
            text: 'cippa',
            listId: 0
        }
    ];

    lists = [
        {
            listId: 0,
            name: 'lita dupa'
        },
        {
            listId: 1,
            name: 'Another dupa'
        },
        {
            listId: 2,
            name: 'benis'
        }
    ]

    render () {
        const lists = this.lists;
        const listsList = lists.map((list) => 
            <List cards={this.cards} list={list} key={list.listId}></List>
        );
        return (

            <ul>
                { listsList }
            </ul>
        )
    }
}

export default Board;