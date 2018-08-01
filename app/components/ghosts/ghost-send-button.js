import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import { vars, helpers } from '../../styles/styles';
import icons from '../helpers/icons';

const { fabSize } = vars;

const fabContainer = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    borderColor: 'red',
    borderWidth: 0
};

const shadowStyle = {
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
        height: 6,
        width: 1
    }
};

@observer
export default class GhostSendButton extends Component {
    render() {
        const fabStyle = {
            flex: 0,
            width: fabSize,
            height: fabSize,
            marginRight: fabSize / 2,
            marginBottom: fabSize,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: this.props.enabled ? vars.fabEnabled : vars.fabDisabled
        };
        const s = [fabStyle, helpers.circle(fabSize), shadowStyle];
        return (
            <View
                style={fabContainer}>
                <TouchableOpacity
                    style={s}
                    activeOpacity={this.props.enabled ? 0.2 : 1}
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={() => this.props.enabled && this.props.send()}>
                    {icons.plainWhite('send')}
                </TouchableOpacity>
            </View>
        );
    }
}

GhostSendButton.propTypes = {
    send: PropTypes.func,
    enabled: PropTypes.bool
};
