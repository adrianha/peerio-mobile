import React from 'react';
import { observer } from 'mobx-react/native';
import ChatList from '../../../components/messaging/chat-list';
import chatState from '../../../components/messaging/chat-state';
import BackIcon from '../../layout/back-icon';
import routes from '../../routes/routes';
import ChannelInviteListItem from '../../../components/messaging/channel-invite-list-item';
import ChannelListItem from '../../../components/messaging/channel-list-item';

@observer
export default class MedcryptorSpaceScreen extends ChatList {
    componentWillMount() {
        chatState.spaceOpen = true;
    }

    componentWillUnmount() {
        chatState.spaceOpen = false;
    }

    get rightIcon() {
        return null;
    }

    get leftIcon() {
        return <BackIcon testID="buttonBackIcon" action={routes.main.chats} />;
    }

    get dataSource() {
        return [
            { title: 'mcr_title_internalRooms', index: 0, data: chatState.store.spaces.currentSpace.internalRooms },
            { title: 'mcr_title_patientRooms', index: 1, data: chatState.store.spaces.currentSpace.patientRooms }
        ];
    }

    get sectionTitles() {
        return ['mcr_title_internalRooms', 'mcr_title_patientRooms'];
    }

    inviteItem = (chat) => <ChannelInviteListItem id={chat.kegDbId} chat={chat} channelName={chat.chatHead.nameInSpace} />;
    channelItem = (chat) => <ChannelListItem chat={chat} channelName={chat.chatHead.nameInSpace} />;
}
