import { CARD_MOVED, LIST_REMOVED, LIST_ADDED, LIST_EDITTED, CARD_ADDED, CARD_REMOVED, CARD_MOVED_ON_LIST, 
    ADDED_COMMENT_TO_CARD, REMOVED_COMMENT_FROM_CARD, EDITTED_COMMENT, EDITTED_CARD_NAME, LIST_MOVED, CARD_DESCRIPTION_EDITTED } from "../types";

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
            ],
            description: 'Trzeba naprawić coś... Tylko co?'
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
            ],
            description: 'Opis musi być'
        }, 
        {
            id: 2,
            text: 'Card 3',
            listId: 0,
            comments: [],
            description: 'Opis musi mieć ileśtam znaków'
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
    ],
    history: [
    ]
};

function updateCards(state, card) {
    const s = { ...state };
    const updatedCardIndex = s.cards.findIndex(x => x.id === card.id)
    s.cards[updatedCardIndex] = card;
    return s.cards;
}

function updateHistory (array, historyItem) {
    const newArray = array.slice();
    newArray.splice(newArray.length, 0, historyItem);
    return newArray;
}

export default function board(state = initialState, action = {}) {
    switch (action.type) {
        case CARD_MOVED:
            return {
                ...state,
                cards: [...updateCards(state, action.card)],
                history: updateHistory([...state.history], action.history)
            };
        case LIST_REMOVED:
        case LIST_ADDED: 
        case LIST_EDITTED: 
        case LIST_MOVED:
            return {
                ...state,
                lists: action.lists,
                history: updateHistory([...state.history], action.history)
            };
        case CARD_ADDED: 
        case CARD_REMOVED:
        case CARD_MOVED_ON_LIST:
        case ADDED_COMMENT_TO_CARD:
        case REMOVED_COMMENT_FROM_CARD:
        case EDITTED_COMMENT:
        case CARD_DESCRIPTION_EDITTED:
            console.log('@@@ reducer', action);
            return {
                ...state,
                cards: action.cards,
                history: updateHistory([...state.history], action.history)
            }
        case EDITTED_CARD_NAME:
            return {
                ...state,
                cards: action.cards,
                lists: state.lists,
                history: updateHistory([...state.history], action.history)
            }
        default:
            return state;
    }
}