import React from 'react';
import { connect } from "react-redux";

class CardDetails extends React.Component {

    state = {};
    
    componentDidMount () {
        console.log('@@ CardDetails', this.state, this.props);
    }
    
    textareaRef;
    addComment = (e) => {
        e.preventDefault();
        this.props.addCommentToCard(e.target[0].value); //input
        e.target[0].value = '';
    }

    deleteComment = (card, comment) => {
        this.props.deleteComment(card, comment);
    }

    startEditComment = (card, comment) => {
        console.log('startEditComment', this.textareaRef);
        this.textareaRef.value = comment.text;
        this.card = card;
        this.comment = comment;
        this.setState({ edit: true });
    }

    editCommentOrCardName = (e) => {
        e.preventDefault();
        console.log('@@ ', this.card, this.comment);        
        this.setState({ edit: false });
        if (this.comment) {
            this.comment.text = e.target[0].value;
            this.props.editComment(this.card, this.comment);
        } else if (this.desc) {
            this.desc = e.target[0].value;
            this.card.description = this.desc;
            this.props.editCardDescription(this.card);
        } else {
            const oldName = this.card.text;
            this.card.text = e.target[0].value;
            this.props.editCardName(this.card, oldName);
        }
        this.card = null;
        this.comment = null;
        e.target[0].value = '';
    }

    editCardName = (e) => {
        e.preventDefault();
        this.card = this.props.card;
        this.textareaRef.value = this.card.text;
        this.setState({ edit: true });
    }
    
    editCardDescription = (e) => {
        e.preventDefault();
        this.card = this.props.card;
        this.desc = this.card.description;
        this.textareaRef.value = this.card.description;
        this.setState({ edit: true });
    }

    render() {
        // const comments = 
        const comments = this.props.card.comments.map(c => 
            <div style={{ background: "bisque", borderBottom: "1px solid orange", marginBottom: "5px" }} key={c.id}>
                <strong>{c.owner}: </strong><span>{c.text}</span>
                <button style={{ border: "none", 
                        position: "absolute",
                        right: "46px",
                        background: "bisque" 
                    }} 
                    onClick={() => this.startEditComment(this.props.card, c)}>e</button>
                <button style={{ border: "none", 
                        position: "absolute",
                        right: "26px",
                        background: "bisque" 
                    }} 
                    onClick={() => this.deleteComment(this.props.card, c)}>x</button>
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
                    <span><strong>{this.props.card.text}</strong></span>
                    <div>{this.props.card.description}</div>
                    <button onClick={(e) => this.editCardName(e)}>en</button>
                    <button onClick={(e) => this.editCardDescription(e)}>ed</button>
                    <hr />
                    Card ID: {this.props.card.id}<br />
                    List ID: {this.props.card.listId}<br />
                    {comments}
                </div>
                    
                <form style={{ height: "27%", position: "relative", marginTop: "6px" }} 
                    id="addCom" 
                    onSubmit={this.state.edit ? (e) => this.editCommentOrCardName(e) : (e) => this.addComment(e) }>
                        <textarea 
                            ref={(input) => {this.textareaRef = input}}
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
                        }}>{this.state.edit ? 'Edit' : 'Add'}</button>
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