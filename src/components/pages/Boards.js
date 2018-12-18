import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { boardAdded, cardMoved, listRemoved, listAdded, listEditted, cardAdded, listMoved, cardsRemoved, cardRestored } from '../../actions/board';
import FormComponent from './Form';
import Board from './Board';
import History from './History';

class Boards extends React.Component {
    state = {
        selectedBoardId: 0,
        data: { name: '' },
        errors: {}
    };

    componentWillReceiveProps(props) {
        console.log('@@ props', props);
    }

    onChange = e => {
        this.setState({
            data: { ...this.state.data, [e.target.name]: e.target.value },
            errors: { ...this.state.errors, [e.target.name]: '' }
        });
    }
    
    closeCreateNewBoardPopup = () => {
        const inputData = { ...this.state.data }
        inputData.name = '';

        this.setState({
            createNewBoardPopupVisible: false,
            data: inputData
        });
    }

    openCreateNewBoardPopup = () => {
        this.setState({ createNewBoardPopupVisible: true });
    }

    selectBoard = (id) => {
        if (this.state.selectedBoardId === id ) { 
            return;
        }
        this.setState({ selectedBoardId: id });
    }

    addNewBoard = (ev) => {
        const boards = [...this.props.boards];
        const newBoard = {
            id: boards.length,
            name: this.state.data.name,
            bg_color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // random hex color
            active: true,
            user_id: 0 // do zmiany po poprawnym logowaniu!!!!!!!!!!!!!!
        }
        
        boards.push(newBoard);
        this.props.addNewBoard(newBoard);

        this.closeCreateNewBoardPopup();
    }

    render() {
        const selectedBoard = this.props.boards.filter(item => item.id === this.state.selectedBoardId).map(item => <Board key={item.id} board={item}/>);
        const boards = this.props.boards.map(item => 
            <div key={item.id} role="none" onClick={() => this.selectBoard(item.id)} 
                style={{ 
                    backgroundColor: item.bg_color, 
                    borderBottom: item.id === this.state.selectedBoardId ? "5px solid red" : "1px solid black",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: item.id === this.state.selectedBoardId ? "not-allowed" : "grab" }}>
                {item.name}
            </div>
        );
        let popup = null;
        if (this.state.createNewBoardPopupVisible) {
            popup = (
                <FormComponent onSubmit={(e) => this.addNewBoard(e)} loading={this.state.loading}
                    errors={this.state.errors} closePopup={this.closeCreateNewBoardPopup} placeholder={"Board name"} data={this.state.data} onChange={this.onChange}/>      
            );
        }

        console.log('Boards ', this.props.boards, selectedBoard);
        return (
            <div>
                <button style={{
                        position: "absolute",
                        top: "25px",
                        width: "300px",
                        left: "20px"
                    }} 
                    onClick={this.openCreateNewBoardPopup}>
                    Create New Board
                </button>
                {popup}
                <div style={{
                        position: "absolute",
                        top: "50px",
                        width: "300px",
                        left: "20px"
                    }}>
                    {boards}
                </div>
                {selectedBoard}  
                    
                <History />
            </div>
        )
    }
}

Boards.propTypes = {
    // moveCard: PropTypes.func,
    // moveList: PropTypes.func,
    // removeList: PropTypes.func,
    // editList: PropTypes.func,
    // addList: PropTypes.func,
    // addNewCardToList: PropTypes.func,
    // restoreCard: PropTypes.func,
    // lists: PropTypes.array,
    // cards: PropTypes.array,
    addNewBoard: PropTypes.func.isRequired,
    boards: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            bg_color: PropTypes.string,
            active: PropTypes.bool,
            user_id: PropTypes.number
    })).isRequired
}

function mapStateToProps(state) {
    console.log('boards mapStateToProps', state);
    return {
        boards: state.board.boards
    };
}

const mapDispatchToState = dispatch => {
    return {
        addNewBoard: board => dispatch(boardAdded(board))
//         moveCard: (card, listFrom, listTo) => dispatch(cardMoved(card, listFrom, listTo)),
//         moveList: (lists, listName) => dispatch(listMoved(lists, listName)),
//         removeList: (lists, cards, listName) => dispatch(listRemoved(lists, cards, listName)),
//         addList: (lists, listName) => dispatch(listAdded(lists, listName)),
//         editList: (lists, oldName, newName) => dispatch(listEditted(lists, oldName, newName)),
//         addNewCardToList: (cards, cardName, listName) => dispatch(cardAdded(cards, cardName, listName)),
//         deleteAllMarkedCards: (lists, cards, cardsNumber) => dispatch(cardsRemoved(lists, cards, cardsNumber)),
//         restoreCard: (cards, cardName) => dispatch(cardRestored(cards, cardName))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Boards);