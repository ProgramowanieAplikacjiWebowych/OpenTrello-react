import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Form, Button, Grid, Segment, Image } from "semantic-ui-react";
import InlineError from "../messages/InlineError";

import List from './List';
import { cardMoved, listRemoved, listAdded, listEditted, cardAdded } from '../../actions/board';
import FormComponent from './Form';

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
        const card = JSON.parse(ev.dataTransfer.getData('card'));

        card.listId = list.listId
        this.props.moveCard(card);
    }

    onChange = e => {
        this.setState({
            data: { ...this.state.data, [e.target.name]: e.target.value },
            errors: { ...this.state.errors, [e.target.name]: '' }
        });
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
            return item.listId === listToEdit;
        });

        lists[index].name = this.state.data.name;

        this.setState({ lists });
        this.props.editList(lists);
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
        this.props.addList(newLists);

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

    deleteList = (e, listId) => {
        const lists = [...this.props.lists];
        const index = lists.findIndex((item) => {
            return item.listId === listId;
        });
        lists.splice(index, 1);

        this.setState({ lists });
        this.props.removeList(lists);
    }

    editList = (e, listId) => {
        this.setState({ editListPopupVisible: true, listToEdit: listId });
    }

    addCardToList = (e, listId) => {
        this.setState({ newCardPopupVisible: true, listToEdit: listId })
    }

    addNewCard = (e) => {
        const cards = [...this.props.cards];

        const card = cards[cards.length - 1];

        const cardItem = {
            id: card ? card.id + 1 : 0,
            text: this.state.data.name,
            listId: this.state.listToEdit
        }
        cards.push(cardItem)

        this.setState({ cards });
        this.props.addNewCardToList(cards);
        
        this.closeCreateNewListPopup();
    }

    render() {
        let popup = null;
        if (this.state.createNewListPopupVisible || this.state.editListPopupVisible || this.state.newCardPopupVisible) {
            popup = (
                <FormComponent onSubmit={this.state.newCardPopupVisible ? (e) => this.addNewCard(e) : (e) => this.createNewOrEditList(e)} loading={this.state.loading}
                    errors={this.state.errors} closePopup={this.closeCreateNewListPopup} placeholder={this.getPlaceholder()} data={this.state.data} onChange={this.onChange}/>
                // <Form onSubmit={this.state.newCardPopupVisible ? (e) => this.addNewCard(e) : (e) => this.createNewOrEditList(e)} loading={this.state.loading}>
                //     <Grid columns={2} stackable>
                //         <Grid.Row>
                //             <Grid.Column>
                //                 <Form.Field error={!!this.state.errors.name}>
                //                     {this.state.editListPopupVisible ? <label htmlFor="name">List new name</label> : <label htmlFor="name">New list name</label>}
                //                     <input
                //                         type="text"
                //                         id="name"
                //                         name="name"
                //                         placeholder={this.getPlaceholder()}
                //                         value={this.state.data.name}
                //                         onChange={this.onChange}
                //                     />
                //                     {this.state.errors.name && <InlineError text={this.state.errors.name} />}
                //                 </Form.Field>

                //                 <Grid.Row>
                //                     <Grid.Column>
                //                         <Button primary>Create</Button>
                //                     </Grid.Column>
                //                     <Grid.Column>
                //                         <Button type="button" onClick={this.closeCreateNewListPopup} secondary>Cancel</Button>
                //                     </Grid.Column>
                //                 </Grid.Row>
                //             </Grid.Column>
                //         </Grid.Row>
                //     </Grid>
                // </Form>
            );
        }

        console.log('Boards', this.props.cards, this.props.cards);
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
                    }}>
                        {list.name}
                        <button onClick={(e) => this.deleteList(e, list.listId)}>X</button>
                        <button onClick={(e) => this.editList(e, list.listId)}>E</button>
                        <button onClick={(e) => this.addCardToList(e, list.listId)}>A</button>
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
            </div>
        )
    }
}

Board.propTypes = {
    moveCard: PropTypes.func,
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
        moveCard: card => dispatch(cardMoved(card)),
        removeList: lists => dispatch(listRemoved(lists)),
        addList: lists => dispatch(listAdded(lists)),
        editList: lists => dispatch(listEditted(lists)),
        addNewCardToList: cards => dispatch(cardAdded(cards))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Board);