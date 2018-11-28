import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

const history = (props) => {


    const h = props.history.map(item =>
        <div key={Math.random()} style={{ borderBottom: "1px orange solid", margin: "10px" }}>
            <strong>{item.user}: </strong><span>{item.event}</span>
            <div>{`${item.time.getFullYear()  }/${  item.time.getMonth() + 1  }/${  item.time.getDate()  } ${  item.time.getHours()  }:${  item.time.getMinutes()  }:${  item.time.getSeconds()}`}</div>
        </div>
    ).reverse();
    return (
        <div style={{
            position: "absolute",
            right: "0",
            top: "25px",
            margin: "25px",
            background: "lightyellow",
            width: "300px",
            height: "90%",
            boxSizing: "border-box"
        }}>
        <div style={{ background: "orange", padding: "10px", position: "absolute", width: "inherit" }}>Event history:</div>
        <div style={{
                display: "inline-block",
                height: "calc(100% - 40px)",
                width: "100%",
                overflow: "scroll",
                marginTop: "40px" 
            }}>
            {h}
        </div>
        </div>
    )
}

history.propTypes = {
    history: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired
}

const mapStateToProps = (state) => {
    console.log('card mapStateToProps', state);
    return {
        history: state.board.history
    };
};

export default connect(mapStateToProps)(history);
