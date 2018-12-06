import React from 'react';

class ListOptions extends React.Component {
    state = {
        listOptionsVisible: false
    }

    switchListOptions = (e, value) => {
        this.setState({ listOptionsVisible: value });
        console.log('listHeader switchListOptions', this.state);
    }

    render () {
        console.log('ListOption', this.props);
        return (
            <div onMouseLeave={(e) => this.switchListOptions(e, false)}>
                <div style={{ width: "30px", margin: "auto 5px" }} onMouseEnter={(e) => this.switchListOptions(e, true)}>
                    <hr />
                    <hr />
                    <hr />
                </div>
                {this.state.listOptionsVisible ? 
                    <div style={{ 
                            position: "fixed",
                            zIndex: 3,
                            border: "1px solid brown"
                        }}>
                        <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }} 
                            onClick={(e) => this.props.deleteList(e, this.props.list)}>Delete list</button>
                        <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }} 
                            onClick={(e) => this.props.editList(e, this.props.list)}>Edit list</button>
                        <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }} 
                            onClick={(e) => this.props.addCardToList(e, this.props.list)}>Add new card</button>
                    </div> : null}
            </div>
        );
    }
}

export default ListOptions;