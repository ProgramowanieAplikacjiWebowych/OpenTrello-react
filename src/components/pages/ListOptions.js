import React from 'react';
import ListOption from './ListOption';

class ListOptions extends React.Component {
    state = {
        listOptionsVisible: false
    }

    switchListOptions = (e, value) => {
        this.setState({ listOptionsVisible: value });
        console.log('listHeader switchListOptions', this.state, value);
    }

    render () {
        const options = [];
        Object.entries(this.props.options).forEach(([key, value]) => {
            options.push(<ListOption key={key} action={(e) => value(e, this.props.list)} optionText={key} />);
        });
        const style = {
            width: "30px",
            backgroundColor: "lightgrey",
            margin: "6px 5px",
            height: "2px"
        };

        return (
            <div onMouseLeave={(e) => this.switchListOptions(e, false)}>
                <div onMouseEnter={(e) => this.switchListOptions(e, true)}>
                    <div style={style}/>
                    <div style={style}/>
                    <div style={style}/>
                </div>
                {this.state.listOptionsVisible ? 
                    <div style={{ 
                            position: "fixed",
                            zIndex: 3,
                            border: "1px solid brown"
                        }}>
                        {options}
                    </div> : null}
            </div>
        );
    }
}

export default ListOptions;