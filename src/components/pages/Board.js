import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Form, Button, Grid, Segment, Image } from "semantic-ui-react";
import InlineError from "../messages/InlineError";

import List from './List';
import { cardMoved, listRemoved, listAdded } from '../../actions/board';

class Board extends React.Component {
    state = {
        loading: false,
        errors: {},
        data: {},
        createNewListPopupVisible: false
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

    closeCreateNewListPopup = () => {
        this.setState({ createNewListPopupVisible: false });
    }

    openCreateNewListPopup = () => {
        this.setState({ createNewListPopupVisible: true });
    }

    createNewList = (e) => {
        if (!e.target[0].value) { // input, ale trzeba zmienic jak bedzie inny element w form'ie
            const errors = { ...this.state.errors };
            errors.name = 'Name is required!';
            this.setState({ errors });
            return;
        }
        const newLists = [...this.props.lists];
        const listItem = newLists[newLists.length - 1];
        
        const newList = {
            name: this.state.data.name,
            listId: listItem ? listItem.listId + 1 : 0
        }
        newLists.push(newList)
        this.closeCreateNewListPopup();
        
        const inputData = { ...this.state.data }
        inputData.name = '';

        this.setState({ lists: newLists, data: inputData });
        this.props.addList(newLists);
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

    render() {
        let popup = null;
        if (this.state.createNewListPopupVisible) {
            popup = (
                <Form onSubmit={this.createNewList} loading={this.state.loading}>
                    <Grid columns={2} stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field error={!!this.state.errors.name}>
                                    <label htmlFor="name">New List Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="New list name"
                                        value={this.state.data.name}
                                        onChange={this.onChange}
                                    />
                                    {this.state.errors.name && <InlineError text={this.state.errors.name} />}
                                </Form.Field>

                                <Grid.Row>
                                    <Grid.Column>
                                        <Button primary>Create</Button>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Button type="button" onClick={this.closeCreateNewListPopup} secondary>Cancel</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
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
                        <button
                            onClick={(e) => this.deleteList(e, list.listId)}
                        >X</button>
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
    addList: PropTypes.func,
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
        addList: lists => dispatch(listAdded(lists))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Board);