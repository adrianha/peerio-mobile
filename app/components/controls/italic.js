import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';

@observer
export default class Italic extends Component {
    render() {
        return (
            <Text italic style={this.props.style}>
                {this.props.children}
            </Text>
        );
    }
}

Italic.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any
};
