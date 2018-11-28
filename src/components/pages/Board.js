import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Form, Button, Grid, Segment, Image } from "semantic-ui-react";
import InlineError from "../messages/InlineError";

import List from './List';
import { cardMoved, listRemoved, listAdded, listEditted, cardAdded, listMoved } from '../../actions/board';
import FormComponent from './Form';
import History from './History';

class Board extends React.Component {
    state = {
        loading: false,
        errors: {},
        data: {},
        createNewListPopupVisible: false,
        editListPopupVisible: false,
        newCardPopupVisible: false
    }

    onDragOver = (e) => {
        e.preventDefault();
    }

    onDrop = (ev, list) => {
        ev.preventDefault();
        if (ev.dataTransfer.types.indexOf('card') >= 0) {
            const card = JSON.parse(ev.dataTransfer.getData('card'));
            if (card.listId === list.listId) {
                return;
            }
            const oldList = this.props.lists.find(item => {
                return item.listId === card.listId;
            });

            card.listId = list.listId
            this.props.moveCard(card, oldList.name, list.name);
        } else if (ev.dataTransfer.types.indexOf('list') >= 0) {
            const movedList = JSON.parse(ev.dataTransfer.getData('list'));
            const lists = [...this.props.lists];
            console.log('list list list ', list);

            const movedListIndex = lists.findIndex(item => {
                return item.listId === movedList.listId;
            });

            const moveToindex = lists.findIndex(item => {
                return item.listId === list.listId;
            });

            const movedElement = lists.splice(movedListIndex, 1);

            lists.splice(moveToindex, 0, ...movedElement);
            
            this.props.moveList(lists, movedElement[0].name);

        }
    }

    onChange = e => {
        this.setState({
            data: { ...this.state.data, [e.target.name]: e.target.value },
            errors: { ...this.state.errors, [e.target.name]: '' }
        });
    }
      
    onDragStart = (ev, element) => {
        console.log('Drag start list', element);
        ev.dataTransfer.setData('list', JSON.stringify(element));
    }

    getPlaceholder() {
        switch (true) {
            case this.state.editListPopupVisible:
                return "List new name";
            case this.state.newCardPopupVisible:
                return "New card name";
            default:
                return "New list name";
        }
    }

    closeCreateNewListPopup = () => {
        const inputData = { ...this.state.data }
        inputData.name = '';

        this.setState({
            createNewListPopupVisible: false,
            editListPopupVisible: false,
            newCardPopupVisible: false,
            listToEdit: null,
            data: inputData
        });
    }

    openCreateNewListPopup = () => {
        this.setState({ createNewListPopupVisible: true });
    }

    editListName = () => {
        const listToEdit = this.state.listToEdit
        const lists = [...this.props.lists];
        const index = lists.findIndex((item) => {
            return item.listId === listToEdit.listId;
        });
        const oldName = lists[index].name;
        const newName = this.state.data.name
        lists[index].name = newName;

        this.setState({ lists });
        this.props.editList(lists, oldName, newName);
    }

    addNewList = () => {
        const newLists = [...this.props.lists];
        const listItem = newLists[newLists.length - 1];

        const newList = {
            name: this.state.data.name,
            listId: listItem ? listItem.listId + 1 : 0
        }
        newLists.push(newList)

        this.setState({ lists: newLists });
        this.props.addList(newLists, newList.name);

    }

    createNewOrEditList = (e) => {
        if (!e.target[0].value) { // input, ale trzeba zmienic jak bedzie inny element w form'ie
            const errors = { ...this.state.errors };
            errors.name = 'Name is required!';
            this.setState({ errors });
            return;
        }

        if (this.state.editListPopupVisible) {
            this.editListName();
        } else {
            this.addNewList();
        }
        this.closeCreateNewListPopup();
    }

    deleteList = (e, list) => {
        const lists = [...this.props.lists];
        const index = lists.findIndex((item) => {
            return item.listId === list.listId;
        });
        const listName = lists[index].name; // needed to proper display history

        lists.splice(index, 1);

        this.setState({ lists });
        this.props.removeList(lists, listName);
    }

    editList = (e, list) => {
        this.setState({ editListPopupVisible: true, listToEdit: list });
    }

    addCardToList = (e, list) => {
        this.setState({ newCardPopupVisible: true, listToEdit: list });
    }

    addNewCard = (e) => {
        const cards = [...this.props.cards];

        const card = cards[cards.length - 1];

        const cardItem = {
            id: card ? card.id + 1 : 0,
            text: this.state.data.name,
            listId: this.state.listToEdit.listId
        }
        const listName = this.state.listToEdit.name;

        cards.push(cardItem)

        this.setState({ cards });
        this.props.addNewCardToList(cards, cardItem.text, listName);
        
        this.closeCreateNewListPopup();
    }
  

    render() {
        let popup = null;
        if (this.state.createNewListPopupVisible || this.state.editListPopupVisible || this.state.newCardPopupVisible) {
            popup = (
                <FormComponent onSubmit={this.state.newCardPopupVisible ? (e) => this.addNewCard(e) : (e) => this.createNewOrEditList(e)} loading={this.state.loading}
                    errors={this.state.errors} closePopup={this.closeCreateNewListPopup} placeholder={this.getPlaceholder()} data={this.state.data} onChange={this.onChange}/>
            );
        }

        console.log('Boards', this.props.cards, this.props.lists);
        const lists = this.props.lists;
        const listsList = lists.map((list) => {
            return (
                <div style={{ width: '30%', border: '1px solid pink' }}
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, list)}
                    key={list.listId}
                >
                    <div style={{
                            textAlign: "center",
                            borderBottom: "1px solid pink",
                            background: "aliceblue",
                            height: "34px"
                        }}
                        draggable
                        onDragStart={(e) => this.onDragStart(e, list)}>
                        {list.name}
                        <button onClick={(e) => this.deleteList(e, list)}>X</button>
                        <button onClick={(e) => this.editList(e, list)}>E</button>
                        <button onClick={(e) => this.addCardToList(e, list)}>A</button>
                    </div>

                    <List cards={this.props.cards} list={list} />
                </div>
            );
        });

        return (
            <div>
                <button onClick={this.openCreateNewListPopup}>Create New List</button>
                {popup}
                <div style={{
                        display: 'inline-flex',
                        width: '90%'
                    }}>
                    {listsList}
                </div>
                
                <History />
            </div>
        )
    }
}

Board.propTypes = {
    moveCard: PropTypes.func,
    moveList: PropTypes.func,
    removeList: PropTypes.func,
    editList: PropTypes.func,
    addList: PropTypes.func,
    addNewCardToList: PropTypes.func,
    lists: PropTypes.array,
    cards: PropTypes.array
}

function mapStateToProps(state) {
    console.log('board mapStateToProps', state);
    return {
        cards: state.board.cards,
        lists: state.board.lists
    };
}

const mapDispatchToState = dispatch => {
    return {
        moveCard: (card, listFrom, listTo) => dispatch(cardMoved(card, listFrom, listTo)),
        moveList: (lists, listName) => dispatch(listMoved(lists, listName)),
        removeList: (lists, listName) => dispatch(listRemoved(lists, listName)),
        addList: (lists, listName) => dispatch(listAdded(lists, listName)),
        editList: (lists, oldName, newName) => dispatch(listEditted(lists, oldName, newName)),
        addNewCardToList: (cards, cardName, listName) => dispatch(cardAdded(cards, cardName, listName))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Board);