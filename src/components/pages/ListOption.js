import React from 'react';
import PropTypes from 'prop-types';

const listOption = (props) =>
    <button style={{ display: "block", width: "100%", webkitAppearance: "button-bevel" }}
        onClick={props.action}>
        {props.optionText}
    </button>;

listOption.propTypes = {
    optionText: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired
};

export default listOption;