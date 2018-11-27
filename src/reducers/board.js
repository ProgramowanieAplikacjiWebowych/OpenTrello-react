import { CARD_MOVED, LIST_REMOVED, LIST_ADDED, LIST_EDITTED, CARD_ADDED, CARD_REMOVED, CARD_MOVED_ON_CARD, ADDED_COMMENT_TO_CARD, REMOVED_COMMENT_FROM_CARD } from "../types";

const initialState = {
    // tmp 
    cards: [
        {
            id: 0,
            text: 'Card 1',
            listId: 1,
            comments: [
                {
                    id: 0,
                    owner: 'Andrzej',
                    text: 'Jakiś komentarz'
                }
            ]
        },
        {
            id: 1,
            text: 'Card 2',
            listId: 0,
            comments: [
                {
                    id: 0,
                    owner: 'Czesław',
                    text: 'Siema!'
                }
            ]
        }, 
        {
            id: 2,
            text: 'Card 3',
            listId: 0,
            comments: []
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
        case LIST_ADDED: 
        case LIST_EDITTED: 
            return {
                ...state,
                lists: action.lists
            };
        case CARD_ADDED: 
        case CARD_REMOVED:
        case CARD_MOVED_ON_CARD:
        case ADDED_COMMENT_TO_CARD:
        case REMOVED_COMMENT_FROM_CARD:
        console.log('@@@ reducer', action);
            return {
                ...state,
                cards: action.cards
            }
        default:
            return state;
    }
}