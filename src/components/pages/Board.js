import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Form, Button, Grid, Segment, Image } from "semantic-ui-react";
import InlineError from "../messages/InlineError";

import List from './List';
import { cardMoved, listRemoved, listAdded, listEditted, cardAdded, listMoved, cardsRemoved, cardRestored } from '../../actions/board';
import FormComponent from './Form';
import History from './History';
import ListOptions from './ListOptions';
import ListHeader from './ListHeader';

class Board extends React.Component {
    state = {
        loading: false,
        errors: {},
        data: {},
        createNewListPopupVisible: false,
        editListPopupVisible: false,
        newCardPopupVisible: false,
        showArchived: false
    }

    componentWillReceiveProps(props) {
        console.log('@@ props', props);
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
            listId: listItem ? listItem.listId + 1 : 0,
            boardId: this.props.board.id
        };

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
        const cards = [...this.props.cards];
        const index = lists.findIndex((item) => item.listId === list.listId);
        const listToDelete = lists[index]; // needed to proper display history
        const remainingCards = cards.filter(item => item.listId !== listToDelete.listId); // remove cards from this list too

        lists.splice(index, 1);

        this.props.removeList(lists, remainingCards, listToDelete.name);
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
            listId: this.state.listToEdit.listId,
            comments: [],
            description: ' ',
            marked: false
        }
        const listName = this.state.listToEdit.name;

        cards.push(cardItem)

        this.setState({ cards });
        this.props.addNewCardToList(cards, cardItem.text, listName);
        
        this.closeCreateNewListPopup();
    }

    deleteAllMarkedCards = () => {
        const cards = this.props.cards;
        const remainingCards = cards.filter(item => !item.marked);
        const cardsNumber = cards.length - remainingCards.length;
        
        cards.filter(item => {
            const i = item;
            i.archived = item.marked;
            return i.marked;
        });


        this.props.deleteAllMarkedCards(this.props.lists, cards, cardsNumber);
    }

    restoreCard = (e, card) => {
        const cardToRestore = card;
        cardToRestore.archived = false;
        cardToRestore.marked = false;

        this.props.restoreCard([...this.props.cards], card.text);
    }

    isAnyCardMarked = () => {
        const cards = this.props.cards;

        const markedCards = cards.filter(item => item.marked && !item.archived);

        return !!markedCards.length;
    }

    render() {
        let popup = null;
        if (this.state.createNewListPopupVisible || this.state.editListPopupVisible || this.state.newCardPopupVisible) {
            popup = (
                <FormComponent onSubmit={this.state.newCardPopupVisible ? (e) => this.addNewCard(e) : (e) => this.createNewOrEditList(e)} loading={this.state.loading}
                    errors={this.state.errors} closePopup={this.closeCreateNewListPopup} placeholder={this.getPlaceholder()} data={this.state.data} onChange={this.onChange}/>
            );
        }

        console.log('Board', this.props, this.props.lists);
        const lists = this.props.lists;
        const cards = this.props.cards;
        const listsList = lists.filter(item => item.boardId === this.props.board.id).map((list) => {
            return (
                <div key={list.listId} style={{ width: '30%', border: '1px solid pink' }}>
                    <ListHeader                         
                        list={list}
                        onDragStart={this.onDragStart}
                        onDragOver={this.onDragOver}
                        onDrop={this.onDrop}
                        deleteList={this.deleteList}
                        editList={this.editList}
                        addCardToList={this.addCardToList}
                    />
                    <List cards={cards} list={list} />
                </div>
            );
        });
        let archivedCards = cards.filter(card => card.archived).map(card => 
            <div>{card.text}
                <button style={{ position: "absolute", right: "10px" }} onClick={(e) => this.restoreCard(e, card)}>Przywróc</button>
                <hr/>
            </div>);
        if (!archivedCards.length) {
            archivedCards = <div>Brak zarchiwizowanych kart.</div>
        }

        return (
            <div>
                <button onClick={this.openCreateNewListPopup}>Create New List</button>
                <button onClick={() => this.setState({ showArchived: !this.state.showArchived })}>Pokaz zarchiwizowane karty</button>
                {this.isAnyCardMarked() ?
                    <button onClick={(e) => this.deleteAllMarkedCards(e)}>Delete marked cards</button> : null}
                {popup}
                {this.state.showArchived ? 
                    <div style={{
                            border: "1px solid black",
                            position: "fixed",
                            zIndex: 3,
                            width: "300px",
                            background: "antiquewhite",
                            padding: "30px 10px 10px"
                        }}>
                    {archivedCards}
                    </div> : null}
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
    restoreCard: PropTypes.func,
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
        removeList: (lists, cards, listName) => dispatch(listRemoved(lists, cards, listName)),
        addList: (lists, listName) => dispatch(listAdded(lists, listName)),
        editList: (lists, oldName, newName) => dispatch(listEditted(lists, oldName, newName)),
        addNewCardToList: (cards, cardName, listName) => dispatch(cardAdded(cards, cardName, listName)),
        deleteAllMarkedCards: (lists, cards, cardsNumber) => dispatch(cardsRemoved(lists, cards, cardsNumber)),
        restoreCard: (cards, cardName) => dispatch(cardRestored(cards, cardName))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Board);