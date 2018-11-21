import { CARD_MOVED, LIST_REMOVED, LIST_ADDED } from "../types";

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