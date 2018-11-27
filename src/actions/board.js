import { CARD_MOVED, LIST_REMOVED, LIST_ADDED, LIST_EDITTED, CARD_ADDED, CARD_REMOVED, CARD_MOVED_ON_CARD, ADDED_COMMENT_TO_CARD, REMOVED_COMMENT_FROM_CARD } from "../types";

export const cardMoved = data => ({
    type: CARD_MOVED,
    card: data
});

export const listRemoved = data => ({
    type: LIST_REMOVED,
    lists: data
});

export const listAdded = data => ({
    type: LIST_ADDED,
    lists: data
});

export const listEditted = data => ({
    type: LIST_EDITTED,
    lists: data
});

export const cardAdded = data => ({
    type: CARD_ADDED,
    cards: data
});

export const cardRemoved = data => ({
    type: CARD_REMOVED,
    cards: data
});

export const cardMovedOnList = data => ({
    type: CARD_MOVED_ON_CARD,
    cards: data
});

export const addedCommentToCard = data => ({
    type: ADDED_COMMENT_TO_CARD,
    cards: data
});

export const removedCommentFromCard = data => ({
    type: REMOVED_COMMENT_FROM_CARD,
    cards: data
});
