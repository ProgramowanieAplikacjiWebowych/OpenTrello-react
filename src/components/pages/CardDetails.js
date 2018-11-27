import React from 'react';
import { connect } from "react-redux";

class CardDetails extends React.Component {

    state = {};

    componentDidMount () {
        console.log('@@ CardDetails', this.state, this.props);
    }

    addComment = (e) => {
        e.preventDefault();
        this.props.addCommentToCard(e.target[0].value); //input
        e.target[0].value = '';
    }

    deleteComment = (comment) => {
        this.props.deleteComment(comment);
    }

    render() {
        // const comments = 
        const comments = this.props.card.comments.map(c => 
            <div style={{ background: "bisque", borderBottom: "1px solid orange", marginBottom: "5px" }} key={c.id}>
                <strong>{c.owner}: </strong><span>{c.text}</span><br />
                <button style={{ border: "none" }} onClick={() => this.deleteComment(c)}>x</button>
            </div>
        );
        
        return (
            <div style={{
                    width: "95%",
                    height: "95%"
                }}>
                <button style={{
                        position: "absolute",
                        right: "5px",
                        top: "5px",
                        border: "none",
                        background: "transparent"
                    }}
                    onClick={this.props.closeDetails}>x</button>
                <div style={{ 
                        lineHeight: "25px",
                        maxHeight: "70%",
                        height: "70%",
                        overflow: "scroll",
                        marginTop: "16px"
                    }}>
                    <span><strong>{this.props.card.text}</strong></span><br />
                    <hr />
                    Card ID: {this.props.card.id}<br />
                    List ID: {this.props.card.listId}<br />
                    {comments}
                </div>
                    
                <form style={{ height: "27%", position: "relative", marginTop: "6px" }} id="addCom" onSubmit={(e) => this.addComment(e)}>
                        <textarea 
                            form="addCom"
                            style={{
                                position: "absolute",
                                bottom: "5px",
                                width: "90%",
                                border: "none",
                                minHeight: "30px",
                                height: "100%"
                            }} 
                            rows="4"
                            cols="40"
                            type="text" name="comment" placeholder="Your comment here..." onChange={this.onChange}/>
                        <button style={{
                                position: "absolute",
                                right: "0px",
                                margin: "3px 0",
                                bottom: "0",
                                height: "100%",
                                webkitAppearance: "button-bevel"
                        }}>Add</button>
                    </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log('board mapStateToProps', state);
    return {
        cards: state.board.cards,
        lists: state.board.lists
    };
}

export default connect(mapStateToProps)(CardDetails);