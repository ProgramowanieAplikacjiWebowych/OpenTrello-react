import React from 'react';
import { connect } from "react-redux";

const listOptions = (props) => {
    console.log(props);
    return (
        <div>
            <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }} 
                onClick={(e) => props.deleteList(e, props.list)}>Delete list</button>
            <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }} 
                onClick={(e) => props.editList(e, props.list)}>Edit list</button>
            <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }} 
                onClick={(e) => props.addCardToList(e, props.list)}>Add new card</button>
            
            {/* {this.props.markedCards.length ? 
                    <button onClick={(e) => this.props.editList(e, this.props.list)}>Edit list</button> : null} */}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        markedCards: state.board.markedCards
    };
}

export default connect(mapStateToProps)(listOptions);