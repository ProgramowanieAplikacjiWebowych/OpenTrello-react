import { CARD_MOVED, LIST_REMOVED, LIST_ADDED, LIST_EDITTED, CARD_ADDED, CARD_REMOVED, 
    CARD_MOVED_ON_LIST, ADDED_COMMENT_TO_CARD, REMOVED_COMMENT_FROM_CARD, EDITTED_COMMENT, 
    EDITTED_CARD_NAME, LIST_MOVED, CARD_DESCRIPTION_EDITTED, CARD_MARKED, CARDS_REMOVED, CARD_COPIED, CARD_RESTORED } from "../types";

export const cardMoved = (data, from, to) => ({
    type: CARD_MOVED,
    card: data,
    history: { event: 'Card ' + data.text + ' was moved from ' + from + ' to ' + to + '.', time: new Date(), user: 'User 1' }
});

export const listRemoved = (lists, cards, listName) => ({
    type: LIST_REMOVED,
    lists,
    cards,
    history: { event: 'List ' + listName + ' was removed.', time: new Date(), user: 'User 1' }
});

export const listAdded = (data, listName) => ({
    type: LIST_ADDED,
    lists: data,
    history: { event: 'List ' + listName + ' was added.', time: new Date(), user: 'User 1' }
});

export const listEditted = (data, oldName, newName) => ({
    type: LIST_EDITTED,
    lists: data,
    history: { event: 'List name was changed from ' + oldName + ' to: ' + newName, time: new Date(), user: 'User 1' }
});

export const cardAdded = (data, cardName, listName) => ({
    type: CARD_ADDED,
    cards: data,
    history: { event: 'New card ' + cardName + ' was added to: ' + listName + '.', time: new Date(), user: 'User 1' }
});

export const cardRemoved = (data, cardName, listName) => ({
    type: CARD_REMOVED,
    cards: data,
    history: { event: 'Card ' + cardName + ' was removed from ' + listName + '.', time: new Date(), user: 'User 1' }
});

export const cardMovedOnList = (data, cardName, listName) => ({
    type: CARD_MOVED_ON_LIST,
    cards: data,
    history: { event: 'Card ' + cardName + ' was moved inside of ' + listName + '.', time: new Date(), user: 'User 1' }
});

export const addedCommentToCard = (data, comment, cardName) => ({
    type: ADDED_COMMENT_TO_CARD,
    cards: data,
    history: { event: 'New comment: "' + comment + '" was added to ' + cardName + '.', time: new Date(), user: 'User 1' }
});

export const removedCommentFromCard = (data, cardName) => ({
    type: REMOVED_COMMENT_FROM_CARD,
    cards: data,
    history: { event: 'Comment was removed from card ' + cardName + '.', time: new Date(), user: 'User 1' }
});

export const edittedComment = (data, cardName) => ({
    type: EDITTED_COMMENT,
    cards: data,
    history: { event: 'Comment was editted on card ' + cardName + '.', time: new Date(), user: 'User 1' }
});

export const listMoved = (data, listName) => ({
    type: LIST_MOVED,
    lists: data,
    history: { event: 'List ' + listName + ' was moved.', time: new Date(), user: 'User 1' }
});

export const cardNameEditted = (cards, oldName, cardName) => {
    console.log('cardNameEditted', cards);
    return ({
        type: EDITTED_CARD_NAME,
        cards,
        history: { event: 'Card name was changed from ' + oldName + ' to ' + cardName + '.', time: new Date(), user: 'User 1' }
    });
};

export const cardDescriptionEditted = (data, cardName) => ({
    type: CARD_DESCRIPTION_EDITTED,
    cards: data,
    history: { event: 'Description of ' + cardName + ' was editted.', time: new Date(), user: 'User 1' }
});

export const cardMarked = (cards) => ({
    type: CARD_MARKED,
    cards
    // history: { event: 'Description of ' + cardName + ' was editted.', time: new Date(), user: 'User 1' }
});

export const cardsRemoved = (cards, cardsNumber) => {
    console.log(this, cards);
    return ({
    type: CARDS_REMOVED,
    cards,
    history: { event: 'Removed ' + cardsNumber + ' card(s).', time: new Date(), user: 'User 1' }
})};

export const cardCopied = (cards, cardName) => ({
        type: CARD_COPIED,
        cards,
        history: { event: cardName + ' duplicated.', time: new Date(), user: 'User 1' }
});

export const cardRestored = (cards, cardName) => ({
        type: CARD_RESTORED,
        cards,
        history: { event: cardName + ' restored.', time: new Date(), user: 'User 1' }
});
