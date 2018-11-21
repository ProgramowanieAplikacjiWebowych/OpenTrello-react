import { CARD_MOVED, LIST_REMOVED, LIST_ADDED } from "../types";

const initialState = {
    // tmp 
    cards: [
        {
            id: 0,
            text: 'Card 1',
            listId: 1
        },
        {
            id: 1,
            text: 'Card 2',
            listId: 0
        }, {
            id: 2,
            text: 'Card 3',
            listId: 0
        }
    ],
    lists: [
        {
            listId: 0,
            name: 'List 1'
        },
        {
            listId: 1,
            name: 'Another list'
        },
        {
            listId: 2,
            name: 'List 3'
        }
    ]
};

function updateCards(state, card) {
    const s = { ...state };
    const updatedCardIndex = s.cards.findIndex(x => x.id === card.id)
    s.cards[updatedCardIndex] = card;
    return s.cards;
}

export default function board(state = initialState, action = {}) {
    switch (action.type) {
        case CARD_MOVED:
            return {
                ...state,
                cards: [...updateCards(state, action.card)]
            };
        case LIST_REMOVED:
            return {
                ...state,
                lists: action.lists
            }
        case LIST_ADDED: 
            return {
                ...state,
                lists: action.lists
            }
        default:
            return state;
    }
}