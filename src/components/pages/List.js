import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'


import { cardRemoved, cardMovedOnList, addedCommentToCard, removedCommentFromCard, edittedComment, cardNameEditted } from '../../actions/board';
import Card from './Card';
import FormComponent from './Form';
import CardDetails from './CardDetails';

class List extends React.Component {

    state = {
        errors: {},
        data: { name: '' }
    }

    onDragOver = (e) => {
        e.preventDefault();
    }

    onDrop = (e, listId, cardId) => {
        // ZAMIENIAM MIEJSCAMI KARTY, DODAJE NOWA => ERROR
        const card = JSON.parse(e.dataTransfer.getData('card'));
        console.log('onDrop list', listId, card, e.target);

        if (listId !== card.listId) {

            card.listId = listId
            // return;
        }

        const cards = [...this.props.cards];
        console.log('Cerds:', cards);
        const index = cards.findIndex((item) => {
            return item.id === card.id;
        });

        const cardIndex = cards.findIndex((item) => {
            return item.id === cardId;
        })

        const movedElement = cards.splice(index, 1);
        console.log('On drop list moved el.', movedElement, cards, index, cardId, cardIndex);

        cards.splice(cardIndex, 0, ...movedElement);
        console.log('On drop list splice carda', cards);


        // this.setState({ cards });
        this.props.moveCard(cards);
        // const a = cards.splice(index, 1, ...movedElement);
        // const card = JSON.parse(e.dataTransfer.getData('card'));

        // card.listId = list.listId
        // this.props.moveCard(card);
    }

    onChange = e => {
        this.setState({
            data: { ...this.state.data, [e.target.name]: e.target.value },
            errors: { ...this.state.errors, [e.target.name]: '' }
        });
    }

    deleteCard = (e, id) => {
        e.stopPropagation();
        const cards = [...this.props.cards];
        const index = cards.findIndex((item) => {
            return item.id === id;
        });

        cards.splice(index, 1);

        this.setState({ cards });
        this.props.removeCard(cards);
    }

    openAddCommentPopup = (e, id) => {
        e.stopPropagation();
        this.setState({ showCommentPopup: true, cardId: id });
    }

    closePopup = () => {
        this.setState({ showCommentPopup: false, cardId: null });
    }

    addCommentToCard = (t) => {
        const cards = [...this.props.cards];
        const index = cards.findIndex((item) => {
            return item.id === this.state.cardId;
        });

        const comments = cards[index].comments;
        let commentId = 0;

        if (comments.length) {
            commentId = comments[comments.length - 1].id;
        }

        comments.push({
            id: commentId + 1,
            owner: 'User 1',
            text: this.state.data.name || t
        });

        this.setState({ cards });
        this.props.addCommentToCard(cards);
        if (!this.state.showCardDetails) {
            this.closePopup();
        };
    }

    deleteComment = (card, comment) => {
        const cards = [...this.props.cards];
        // let index = cards.findIndex((item) => { // TUTAJ DO POPRAWY. THIS JAK W ADDED
        //     return item === this.state.cardId;
        // });

        const comments = card.comments;
        const index = comments.findIndex((item) => {
            return item === comment;
        });

        comments.splice(index, 1);

        this.setState({ cards });
        this.props.removeCommentFromCard(cards);
    }

    editComment = (card, comment) => {
        const cards = [...this.props.cards];

        const comments = card.comments;
        const index = comments.findIndex((item) => {
            return item.id === comment.id;
        });

        comments[index] = comment;

        this.setState({ cards });
        this.props.editComment(cards);
    }

    editCardName = (card) => {
        const cards = [...this.props.cards];
        
        const index = cards.findIndex((item) => {
            return item.id === card.id;
        });
        
        cards[index] = card;

        this.setState({ cards });
        this.props.editCardName(cards);
    }

    editCardDescription = (card) => {
        this.editCardName(card); // funkcje robią to samo
    }

    openCardDetails = (e, id) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('@##! openCardDet', id, this.props);
        this.setState({ showCardDetails: true, cardId: id });
        // this.props.history.push("/card-details/" + id);
    }

    closeCardDetails = () => {
        this.setState({ showCardDetails: false, cardId: null });
    }

    render() {
        let popup = null;
        let cardDetails = null;
        let cards = this.props.cards;
        const cardList = cards.filter((card) => {
            if (card.listId === this.props.list.listId) {
                return card;
            }
        });

        cards = cardList.map((card) =>
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div className="list-group-item"
                onDragOver={(e) => this.onDragOver(e)}
                onDrop={(e) => this.onDrop(e, card.listId, card.id)}
                onClick={(e) => this.openCardDetails(e, card.id)}
                key={card.id}><Card card={card} />
                <button onClick={(e) => this.deleteCard(e, card.id)}>X</button>
                <button onClick={(e) => this.openAddCommentPopup(e, card.id)}>C</button>
            </div>
        );

        if (this.state.showCommentPopup) {
            popup = <FormComponent onSubmit={this.addCommentToCard} loading={this.state.loading}
                errors={this.state.errors} closePopup={this.closePopup} placeholder="Comment text here" data={this.state.data} onChange={this.onChange} />
        }

        if (this.state.showCardDetails) {
            const card = this.props.cards.find(item => {
                return item.id === this.state.cardId;
            });

            cardDetails = <div style={{
                    position: "fixed",
                    width: "450px",
                    height: "500px",
                    background: "antiquewhite",
                    zIndex: 2,
                    border: "1px solid",
                    borderRadius: "5px",
                    alignSelf: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box"
                }}>
                <CardDetails card={card} 
                    closeDetails={this.closeCardDetails} 
                    addCommentToCard={(e) => this.addCommentToCard(e)} 
                    deleteComment={this.deleteComment}
                    editComment={this.editComment}
                    editCardName={this.editCardName}
                    editCardDescription={this.editCardDescription} />
            </div>
        }

        return (
            <div className="list-group">
                {cards}
                {popup}
                {cardDetails}
            </div>
        )
    }
}

List.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
    list: PropTypes.instanceOf(Object).isRequired,
    removeCard: PropTypes.func,
    moveCard: PropTypes.func,
    addCommentToCard: PropTypes.func,
    removeCommentFromCard: PropTypes.func,
    editCardName: PropTypes.func
}

const mapDispatchToState = dispatch => {
    return {
        removeCard: cards => dispatch(cardRemoved(cards)),
        moveCard: cards => dispatch(cardMovedOnList(cards)),
        addCommentToCard: cards => dispatch(addedCommentToCard(cards)),
        removeCommentFromCard: cards => dispatch(removedCommentFromCard(cards)),
        editComment: cards => dispatch(edittedComment(cards)),
        editCardName: (cards) => dispatch(cardNameEditted(cards)),
    }
}

export default withRouter(connect(null, mapDispatchToState)(List));