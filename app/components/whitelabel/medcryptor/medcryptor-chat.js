import React from 'react';
import { observer } from 'mobx-react/native';
import chatState from '../../../components/messaging/chat-state';
import BackIcon from '../../layout/back-icon';
import routes from '../../routes/routes';
import Chat from '../../../components/messaging/chat';
import { vars } from '../../../styles/styles';
import MedcryptorChatZeroStatePlaceholder from './medcryptor-chat-zero-state-placeholder';
import MedcryptorChatBeginningNotice from './medcryptor-chat-beginning-notice';

function backFromChat(chat) {
    if (chat.isInSpace) {
        return routes.main.space();
    }
    return routes.main.chats();
}

@observer
export default class MedcryptorChat extends Chat {
    get leftIcon() {
        return <BackIcon testID="buttonBackIcon" action={() => backFromChat(this.chat)} />;
    }

    zeroStatePlaceholder() {
        return <MedcryptorChatZeroStatePlaceholder />;
    }

    chatNotice(chat) {
        return <MedcryptorChatBeginningNotice chat={chat} />;
    }

    get background() {
        return chatState.store.spaces.isPatientRoomOpen ? vars.peerioBlueBackground15 : vars.white;
    }
}
