import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'


import { cardRemoved, cardMovedOnList, addedCommentToCard, removedCommentFromCard, edittedComment, cardNameEditted, 
    cardDescriptionEditted, cardMarked, cardCopied } from '../../actions/board';
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

        this.props.moveCard(cards, movedElement[0].text, this.props.list.name); // przenosiny na tej samej liscie
    }

    onChange = e => {
        this.setState({
            data: { ...this.state.data, [e.target.name]: e.target.value },
            errors: { ...this.state.errors, [e.target.name]: '' }
        });
    }

    deleteCard = (e, card) => {
        e.stopPropagation();
       
        const archivedCard = card; // a tu nie ma {} bo chcemy zmodyfikowac te karte z listy \ js /
        archivedCard.archived = true;

        this.props.removeCard([...this.props.cards], archivedCard.text, this.props.list.name);
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

        const newComment = {
            id: commentId + 1,
            owner: 'User 1',
            text: this.state.data.name || t
        };

        comments.push(newComment);

        this.setState({ cards });
        this.props.addCommentToCard(cards, newComment.text, cards[index].text, );
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
        this.props.removeCommentFromCard(cards, card.text);
    }

    editComment = (card, comment) => {
        const cards = [...this.props.cards];

        const comments = card.comments;
        const index = comments.findIndex((item) => {
            return item.id === comment.id;
        });

        comments[index] = comment;

        this.setState({ cards });
        this.props.editComment(cards, card.text);
    }

    editCardName = (card, oldName) => {
        const cards = [...this.props.cards];
        
        const index = cards.findIndex((item) => {
            return item.id === card.id;
        });

        cards[index] = card;

        this.setState({ cards });
        this.props.editCardName(cards, oldName, card.text);
    }

    editCardDescription = (card) => {
        const cards = [...this.props.cards];
        
        const index = cards.findIndex((item) => {
            return item.id === card.id;
        });
        
        cards[index] = card;

        this.setState({ cards });
        this.props.editCardDescription(cards, card.text);
        // this.editCardName(card); // funkcje robią to samo
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

    optionSelected = (e, card) => {
        e.stopPropagation();
        const cards = this.props.cards;
        const index = cards.findIndex(item => item === card);
        cards[index].marked = e.target.checked;

        this.props.markCardAsSelected(cards);
        console.log('Option selected', card, e.target.checked);
    }

    copyCard = (e, card) => {
        e.stopPropagation();
        const cards = [...this.props.cards];
        const lastCard = cards[cards.length - 1];
        const newCard = {...card}; // jak sie zrobi bez spread to modyfikuje tez kopiowana karte. \ js /
        newCard.id = lastCard ? lastCard.id + 1 : 0

        cards.push(newCard)

        this.props.copyCard(cards, newCard.text);
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

        cards = cardList.map((card) => !card.archived ?
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div className="list-group-item"
                onDragOver={(e) => this.onDragOver(e)}
                onDrop={(e) => this.onDrop(e, card.listId, card.id)}
                onClick={(e) => this.openCardDetails(e, card.id)}
                key={card.id}>
                <Card card={card} />
                <input type="checkbox" name="checkbox" value="false" onClick={(e) => this.optionSelected(e, card)} />
                <button onClick={(e) => this.deleteCard(e, card)}>Delete card</button>
                <button onClick={(e) => this.openAddCommentPopup(e, card.id)}>Add comment</button>
                <button onClick={(e) => this.copyCard(e, card)}>Copy card</button>
            </div> : null
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
    editCardName: PropTypes.func,
    cardDescriptionEditted: PropTypes.func,
    markCardAsSelected: PropTypes.func,
    copyCard: PropTypes.func
}

const mapDispatchToState = dispatch => {
    return {
        removeCard: (cards, cardName, listName) => dispatch(cardRemoved(cards, cardName, listName)),
        moveCard: (cards, cardName, listName) => dispatch(cardMovedOnList(cards, cardName, listName)),
        addCommentToCard: (cards, comment, cardName) => dispatch(addedCommentToCard(cards, comment, cardName)),
        removeCommentFromCard: (cards, cardName) => dispatch(removedCommentFromCard(cards, cardName)),
        editComment: (cards, cardName) => dispatch(edittedComment(cards, cardName)),
        editCardName: (cards, oldName, cardName) => dispatch(cardNameEditted(cards, oldName, cardName)),
        editCardDescription: (cards, cardName) => dispatch(cardDescriptionEditted(cards, cardName)),
        markCardAsSelected: (cards) => dispatch(cardMarked(cards)),
        copyCard: (cards, cardName) => dispatch(cardCopied(cards, cardName))
    }
}

export default withRouter(connect(null, mapDispatchToState)(List));