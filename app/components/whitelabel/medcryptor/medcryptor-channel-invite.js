
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import BackIcon from '../../layout/back-icon';
import routes from '../../routes/routes';
import ChannelInvite from '../../messaging/channel-invite';
import uiState from '../../layout/ui-state';
import invitationState from './medcryptor-invitation-state';

function backFromChat(invitation) {
    if (invitation.isInSpace) {
        return routes.main.space();
    }
    return routes.main.chats();
}

@observer
export default class MedcryptorChannelInvite extends ChannelInvite {
    get invitation() { return invitationState.currentInvitation; }

    get leftIcon() {
        return <BackIcon testID="buttonBackIcon" action={() => backFromChat(this.invitation)} />;
    }

    get inviteText() {
        let label = 'title_roomInviteHeading';
        if (this.invitation.isInSpace) {
            if (this.invitation.chatHead.spaceRoomType === 'patient') {
                label = 'mcr_title_roomInviteHeading_patient';
            } else {
                label = 'mcr_title_roomInviteHeading_internal';
            }
        }
        return label;
    }

    get inviteRoomName() {
        let label = this.invitation.channelName;
        if (this.invitation.isInSpace) {
            label = this.invitation.chatHead.nameInSpace;
        }
        return label;
    }

    @action.bound declineInvite() {
        uiState.declinedChannelId = this.invitation.kegDbId;
        backFromChat(this.invitation);
    }
}
