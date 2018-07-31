import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Share } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import BasicSettingsItem from './basic-settings-item';
import { settingsState, snackbarState, mainState, loginState, contactState, chatState } from '../states';
import { toggleConnection } from '../main/dev-menu-items';
import plans from '../payments/payments-config';
import { tx, tu } from '../utils/translator';
import { warnings, clientApp, User, contactStore } from '../../lib/icebear';
import { popupAbout, popupInputCancel } from '../shared/popups';
import ButtonWithIcon from '../controls/button-with-icon';
import { scrollHelper } from '../helpers/test-helper';
import icons from '../helpers/icons';
import AvatarCircle from '../shared/avatar-circle';
import PaymentStorageUsageItem from '../payments/payments-storage-usage-item';
import ViewWithDrawer from '../shared/view-with-drawer';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    backgroundColor: vars.darkBlueBackground05
};

const svStyle = {
    padding: vars.settingsListPadding
};

const descriptionTextStyle = {
    color: vars.peerioBlue,
    fontSize: vars.font.size.smaller
};

@observer
export default class SettingsLevel1 extends SafeComponent {
    get spacer() {
        return <View style={{ height: 16 }} />;
    }

    leftSettingsIcon(iconName, iconColor) {
        return icons.plain(iconName, null, iconColor, null, { paddingLeft: vars.iconPadding });
    }

    leftSettingsImageIcon(iconSource) {
        return icons.imageIcon(iconSource);
    }

    get avatarCircle() {
        return (<View style={{ marginLeft: vars.iconPadding }} >
            <AvatarCircle contact={contactStore.getContact(User.current.username)} />
        </View>);
    }

    testSilentInvite = async () => {
        const result = await popupInputCancel('Enter email to invite', 'test@test.com', true);
        if (!result) return;
        const email = result.value;
        console.log(email);
        contactStore.inviteNoWarning(email, undefined, true);
    };

    testShare() {
        const message = 'chat and share files securely using Peerio. https://www.testurl.com';
        const title = 'peerio';
        const url = 'https://www.testurl.com';
        Share.share({ message, title, url });
    }

    testNullActiveChat() {
        chatState.routerMain.chats(chatState.store.chats[0]);
        setTimeout(() => {
            chatState.store.activeChat = null;
        }, 5000);
    }

    resetExternalSetting = () => {
        clientApp.uiUserPrefs.externalContentConsented = false;
    };

    /**
     * Scroll helper is used to provide scrolling capability
     * to the test script. Note that it overrides ref and onScroll
     * event handlers
     */
    renderThrow() {
        const plan = plans.topPlan();
        const upgradeItem = plan ?
            (<SettingsItem title={tx('title_viewYourPlan', { title: plan.title })}
                onPress={() => settingsState.upgrade()}
                leftComponent={this.leftSettingsIcon('open-in-browser', vars.darkBlue)} />) :
            (<SettingsItem title="button_upgrade"
                onPress={() => settingsState.upgrade()}
                leftComponent={this.leftSettingsIcon('open-in-browser', vars.darkBlue)}>
                <Text style={[descriptionTextStyle, { position: 'absolute', right: 0 }]}>{tx('title_getMoreGoPro')}</Text>
            </SettingsItem>);
        return (
            <ViewWithDrawer style={bgStyle}>
                <ScrollView contentContainerStyle={svStyle} {...scrollHelper}>
                    <SettingsItem title={User.current.fullName} description={User.current.username} rightIcon={null} semibold large
                        onPress={() => settingsState.transition('profile')}
                        leftComponent={this.avatarCircle} />
                    {this.spacer}

                    <SettingsItem title="title_settingsProfile"
                        onPress={() => settingsState.transition('profile')}
                        leftComponent={this.leftSettingsImageIcon(require('../../assets/icons/public-profile-active.png'))} />
                    <SettingsItem title="title_settingsSecurity"
                        onPress={() => settingsState.transition('security')}
                        leftComponent={this.leftSettingsIcon('security', vars.yellow)} />
                    <SettingsItem title="title_settingsPreferences"
                        onPress={() => settingsState.transition('preferences')}
                        leftComponent={this.leftSettingsImageIcon(require('../../assets/icons/preferences-active.png'))} />
                    {this.spacer}

                    <SettingsItem title="title_settingsAccount"
                        onPress={() => settingsState.transition('account')}
                        leftComponent={this.leftSettingsIcon('account-circle', vars.accountSettingsIconColor)} />
                    {!process.env.PEERIO_DISABLE_PAYMENTS && upgradeItem}
                    {this.spacer}

                    <SettingsItem title="title_About"
                        icon={null} onPress={() => popupAbout()}
                        leftComponent={this.leftSettingsIcon('info', vars.peerioTeal)} />
                    <SettingsItem title="title_help"
                        onPress={() => settingsState.transition('logs')}
                        leftComponent={this.leftSettingsIcon('help', vars.helpSettingsIconColor)} />

                    <PaymentStorageUsageItem />

                    <ButtonWithIcon
                        text={tu('button_logout')}
                        accessibilityLabel="button_logout"
                        style={{
                            backgroundColor: vars.signoutSettingsButtonBg,
                            width: '100%',
                            paddingVertical: vars.spacing.medium.mini2x,
                            borderRadius: 4
                        }}
                        bold
                        color={vars.red}
                        textStyle={{ color: vars.peerioBlue }}
                        onPress={loginState.signOut}
                        iconName="power-settings-new"
                        testID="button_signOut"
                    />
                    {this.spacer}
                    {__DEV__ && <BasicSettingsItem title="silent invite" onPress={this.testSilentInvite} />}
                    {__DEV__ && <BasicSettingsItem title="toggle connection" onPress={toggleConnection} />}
                    {__DEV__ && <BasicSettingsItem title="damage TouchID" onPress={() => mainState.damageUserTouchId()} />}
                    {__DEV__ && <BasicSettingsItem title="snackbar" onPress={() =>
                        snackbarState.pushTemporary('test')} />}
                    {__DEV__ && <BasicSettingsItem title="snackbar long" onPress={() =>
                        snackbarState.pushTemporary('test whatever you have been testing for a longer snackbar for the win whatever you have been testing for a longer snackbar for the win')} />}
                    {__DEV__ && <BasicSettingsItem title="test Contacts" onPress={() => contactState.testImport()} />}
                    {__DEV__ && <BasicSettingsItem title="test Share" onPress={() => this.testShare()} />}
                    {__DEV__ && <BasicSettingsItem title="test null activeChat" onPress={() => this.testNullActiveChat()} />}
                    {__DEV__ && <BasicSettingsItem title="test warning" onPress={() => warnings.addSevere('warning')} />}
                    {__DEV__ && <BasicSettingsItem title="reset external setting" onPress={this.resetExternalSetting} />}
                    {/* <BasicSettingsItem title={t('payments')} onPress={() => settingsState.transition('payments')} /> */}
                    {/* <BasicSettingsItem title={t('quotas')} onPress={() => settingsState.transition('quotas')} /> */}
                </ScrollView>
            </ViewWithDrawer>
        );
    }
}
