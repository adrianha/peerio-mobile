import React from 'react';
import { action, observable } from 'mobx';
import { Image, View } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { invitationState } from '../states';
import buttons from '../helpers/buttons';
import ButtonText from '../controls/button-text';
import BackIcon from '../layout/back-icon';
import { User, chatInviteStore, contactStore } from '../../lib/icebear';
import routes from '../routes/routes';
import chatState from './chat-state';
import AvatarCircle from '../shared/avatar-circle';
import ChannelUpgradeOffer from '../channels/channel-upgrade-offer';
import ProgressOverlay from '../shared/progress-overlay';
import uiState from '../layout/ui-state';

const emojiTada = require('../../assets/emoji/tada.png');

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    lineHeight: 22
};

const headingSection = {
    paddingTop: 116,
    flex: 0.6
};

const sectionLine = {
    marginHorizontal: vars.spacing.medium.mini2x,
    borderWidth: 1,
    borderColor: vars.black12
};

const infoSection = {
    paddingTop: vars.spacing.medium.mini2x,
    flex: 0.4,
    alignItems: 'center'
};

const infoText = {
    flexDirection: 'row',
    justifyContent: 'center'
};

const hostedByStyle = {
    color: vars.subtleText,
    fontSize: vars.font.size.normal
};

const hostNameStyle = {
    color: vars.black,
    fontSize: vars.font.size.normal
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.medium.mini2x,
    justifyContent: 'center'
};

const moreContainer = {
    backgroundColor: vars.txtLightGrey,
    height: vars.avatarDiameter,
    paddingHorizontal: vars.spacing.small.maxi2x,
    width: vars.avatarDiameter * 2,
    borderRadius: vars.avatarDiameter / 2,
    alignSelf: 'center',
    marginLeft: -vars.avatarDiameter,
    zIndex: -1,
    display: 'flex',
    alignItems: 'center'
};

const moreText = {
    backgroundColor: 'transparent',
    textAlign: 'right',
    alignSelf: 'flex-end',
    lineHeight: vars.avatarDiameter,
    color: vars.white,
    fontSize: vars.font.size.small
};

@observer
export default class ChannelInvite extends SafeComponent {
    @observable waiting = false;

    get invitation() { return invitationState.currentInvitation; }

    @action.bound async acceptInvite() {
        const chatId = this.invitation.kegDbId;
        chatInviteStore.acceptInvite(chatId);
        let newChat = null;
        try {
            this.waiting = true;
            newChat = await chatState.store.getChatWhenReady(chatId);
        } catch (e) {
            console.error(e);
        }
        // if we failed to accept invite, newChat is null
        // and it just goes to the chat list
        routes.main.chats(newChat);
    }

    @action.bound declineInvite() {
        uiState.declinedChannelId = this.invitation.kegDbId;
        routes.main.chats();
    }

    get leftIcon() { return <BackIcon action={routes.main.chats} />; }

    get inviteText() { return 'title_roomInviteHeading'; }

    get inviteRoomName() { return this.invitation.channelName; }

    get participants() {
        const { participants } = this.invitation;
        if (!participants || participants.length <= 2) { return null; }

        const maxToShow = 4;
        const withoutCurrentAndHost = participants
            .filter(x => x !== User.current.username)
            .filter(x => x !== this.invitation.username);

        const toRender = withoutCurrentAndHost.slice(0, maxToShow);

        const notShown = withoutCurrentAndHost.length - maxToShow;

        return (
            <View style={{ alignItems: 'center' }}>
                <View style={infoText}>
                    <Text style={hostedByStyle}>
                        {tx('title_whoIsAlreadyIn')}
                    </Text>
                    <Text style={hostNameStyle}>
                        &nbsp;#{this.inviteRoomName}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {toRender.map(participant => (
                        <View style={{ marginLeft: -vars.spacing.small.midi }}>
                            <AvatarCircle key={participant} contact={contactStore.getContact(participant)} />
                        </View>
                    ))}
                    {notShown > 0 &&
                        <View style={moreContainer}>
                            <Text bold style={moreText}>
                                {`+${notShown}`}
                            </Text>
                        </View>}
                </View>
            </View>
        );
    }

    renderThrow() {
        const hasPaywall = User.current.channelsLeft <= 0;
        const host = contactStore.getContact(this.invitation.username);

        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                {!this.waiting && hasPaywall && <ChannelUpgradeOffer />}
                <View style={headingSection}>
                    <Image source={emojiTada}
                        style={{
                            alignSelf: 'center',
                            width: vars.iconSizeMedium,
                            height: vars.iconSizeMedium,
                            marginBottom: vars.spacing.small.mini2x
                        }}
                        resizeMode="contain" />
                    <Text style={headingStyle}>
                        {tx(this.inviteText)}
                    </Text>
                    <Text bold style={headingStyle}>
                        #{this.inviteRoomName}
                    </Text>
                    <View style={buttonContainer}>
                        <ButtonText
                            text="Decline"
                            onPress={this.declineInvite}
                            testID="decline"
                            textColor={vars.peerioBlue}
                            style={{ marginHorizontal: vars.spacing.medium.mini2x, alignItems: 'center' }}
                        />
                        {buttons.roundBlueBgButton(tx('button_accept'), this.acceptInvite, hasPaywall, 'accept', { marginHorizontal: vars.spacing.small.midi2x })}
                    </View>
                </View>
                <View style={sectionLine} />
                <View style={infoSection}>
                    <View style={infoText}>
                        <Text style={hostedByStyle}>
                            {tx('title_hostedBy')}
                        </Text>
                        <Text style={hostNameStyle}>
                            &nbsp;
                            {host.fullName}
                        </Text>
                    </View>
                    <AvatarCircle contact={host} />
                    {this.participants}
                </View>
                <ProgressOverlay enabled={this.waiting} />
            </View>);
    }
}
