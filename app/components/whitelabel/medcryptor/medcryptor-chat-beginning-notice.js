import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Text from '../../controls/custom-text';
import { vars } from '../../../styles/styles';
import { tx } from '../../utils/translator';
import { chatStore } from '../../../lib/icebear';

const textStyle = {
    textAlign: 'left',
    marginTop: vars.spacing.small.maxi2x,
    marginBottom: vars.spacing.small.maxi2x,
    color: vars.txtDark
};

@observer
export default class ChatBeginningNotice extends Component {
    render() {
        const { chat } = this.props;
        return (
            <Text style={textStyle}>
                {chatStore.spaces.isPatientRoomOpen && tx('mcr_title_chatHeaderPatientRoom', { patientName: chat.nameInSpace })}
                {chatStore.spaces.isInternalRoomOpen && tx('mcr_title_chatHeaderInternalRoom', { roomName: chat.nameInSpace })}
                {!chatStore.spaces.activeSpaceId && chat.isChannel && tx('title_chatBeginningRoom', { chatName: chat.name })}
                {!chat.isChannel && tx('title_chatBeginning', { chatName: chat.name })}
            </Text>
        );
    }
}

ChatBeginningNotice.propTypes = {
    chat: PropTypes.object
};
