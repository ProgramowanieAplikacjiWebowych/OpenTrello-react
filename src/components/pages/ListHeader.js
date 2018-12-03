/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import ListOptions from './ListOptions';

class ListHeader extends React.Component {
    state = { 
        listOptionsVisible: false
    };
    
    switchListOptions = (e, value) => {
        this.setState({ listOptionsVisible: value });
        console.log('listHeader switchListOptions', this.state);
    }

    render () {
        return <div
            onDragOver={(e) => this.props.onDragOver(e)}
            onDrop={(e) => this.props.onDrop(e, this.props.list)}
            key={this.props.list.listId}>
            <div style={{
                    width: "100%",
                    display: "flex",
                    background: "aliceblue",
                    borderBottom: "1px solid pink",
                    lineHeight: "2em",
                    position: "relative"
                }}>
                <div style={{ width: "30px", margin: "auto 5px" }} onMouseEnter={(e) => this.switchListOptions(e, true)}>
                    <hr />
                    <hr />
                    <hr />
                </div>
                <div style={{
                        textAlign: "center",
                        height: "34px",
                        width: "calc(100% - 30px)"
                    }}
                    draggable
                    onDragStart={(e) => this.props.onDragStart(e, this.props.list)}>
                    {this.props.list.name}
                </div>
                {this.state.listOptionsVisible ?
                    ( <div style={{ position: "absolute", border: "1px solid brown", zIndex: "3", left: "40px" }}
                        onMouseLeave={(e) => this.switchListOptions(e, false)}>
                        <ListOptions
                            list={this.props.list}
                            deleteList={this.props.deleteList}
                            editList={this.props.editList}
                            addCardToList={this.props.addCardToList}/></div>): null}
            </div>
        </div>
    }
}

export default ListHeader;