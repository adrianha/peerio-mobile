import React from 'react';
import { observer } from 'mobx-react/native';
import { Image, View, ScrollView, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import { vars } from '../../styles/styles';
import { User, contactStore, validation } from '../../lib/icebear';
import { t, tx, tu } from '../utils/translator';
import AvatarActionSheet, { SIZE2 } from './avatar-action-sheet';
import icons from '../helpers/icons';
import uiState from '../layout/ui-state';

const emailFormatValidator = validation.validators.emailFormat.action;

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
};

const textinput = {
    fontSize: 14,
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1
};

const textStatic = {
    fontSize: 14,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1,
    alignSelf: 'center'
};

const flexRow = {
    flexDirection: 'row',
    flex: 0,
    flexGrow: 1,
    alignItems: 'center'
};

const label = {
    color: vars.txtDate,
    marginVertical: 4,
    marginLeft: 10
};

const emailIcon = (
    <View style={{ marginHorizontal: 8 }}>
        {icons.plaindark('email')}
    </View>
);

@observer
export default class ProfileEdit extends SafeComponent {
    @observable firstName;
    @observable lastName;
    @observable newEmailText = null;
    @observable newEmailTextValid = null;
    @observable showValidationError = false;
    @observable showAddEmail = false;

    componentDidMount() {
        const { firstName, lastName } = User.current;
        Object.assign(this, { firstName, lastName });
        uiState.currentScrollView = this._scrollView;
        reaction(() => this.newEmailText, async text => {
            this.showValidationError = false;
            this.newEmailTextValid = await emailFormatValidator(text);
        });
        reaction(() => User.current && User.current.addresses && User.current.addresses.length, () => LayoutAnimation.easeInEaseOut());
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
        uiState.currentScrollViewPosition = 0;
    }

    onScroll = ({ nativeEvent: { contentOffset: { y } } }) => {
        uiState.currentScrollViewPosition = y;
    }

    submit = () => {
        const user = User.current;
        const { firstName, lastName } = user;
        // do not save if no changes have been made
        if (firstName === this.firstName && lastName === this.lastName) return;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        User.current.saveProfile().catch(() => {
            Object.assign(user, { firstName, lastName });
        });
    }

    saveNewEmail = () => {
        if (this.newEmailText && this.newEmailTextValid) User.current.addEmail(this.newEmailText);
        this.cancelNewEmail();
    };

    cancelNewEmail = () => {
        this.newEmailText = '';
        this.showAddEmail = false;
    };

    validateNewEmail() {
        if (this.newEmailText && !this.newEmailTextValid) {
            this.showValidationError = true;
            return false;
        }
        return true;
    }

    async emailAction() {
        if (!this.validateNewEmail()) return;
        await uiState.hideAll();
        LayoutAnimation.easeInEaseOut();
        this.showAddEmail = !this.showAddEmail;
        console.log(this.showAddEmail);
        if (this.showAddEmail) {
            this._addEmailBox.focus();
        }
        if (!this.newEmailText) {
            return;
        }
        this.saveNewEmail();
    }

    get emailButton() {
        let text = 'button_addEmail';
        if (this.showAddEmail) {
            text = this.newEmailText ? 'button_save' : 'button_cancel';
        }
        return this.renderButton1(text, () => this.emailAction(), this.newEmailText && this.showAddEmail && !this.newEmailTextValid);
    }

    get validationError() {
        if (!this.showValidationError) return null;
        return (
            <Text numberOfLines={1} ellipsizeMode="tail" style={[textStatic, { color: vars.txtAlert }]}>
                {tx('error_invalidEmail')}
            </Text>
        );
    }


    renderButton1(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: 12, paddingVertical: 10 }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.bg }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

    renderText(text, style) {
        return (
            <View style={{ flexDirection: 'row', flex: 1, flexGrow: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[textStatic, style]}>
                    {text}
                </Text>
            </View>
        );
    }

    renderUserEmail = (item) => {
        const canDelete = User.current.addresses.length > 1;
        const { address, confirmed, primary } = item;
        const confirmLink = this.renderButton1(
            'button_confirm',
            () => User.current.resendEmailConfirmation(address)
        );
        const primaryLink = this.renderButton1(
            'button_makePrimary',
            () => User.current.makeEmailPrimary(address)
        );
        const deleteIcon = <View>{icons.dark('delete', () => User.current.removeEmail(address))}</View>;
        return (
            <View style={textinputContainer} key={address}>
                {emailIcon}
                <View style={{ height: vars.inputHeight, flex: 1, flexGrow: 1, paddingTop: 4 }}>
                    {this.renderText(address)}
                    {confirmed && primary ? this.renderText(tx('title_primaryEmail'), { color: vars.bg, marginTop: -8 }) : null}
                    {!confirmed ? this.renderText(tx('error_unconfirmedEmail'), { color: vars.txtAlert, marginTop: -8 }) : null}
                </View>
                {confirmed && !primary ? primaryLink : null}
                {confirmed ? null : confirmLink}
                {(!primary && canDelete) ? deleteIcon : null}
            </View>
        );
    }

    get avatarLetter() {
        const contact = contactStore.getContact(User.current.username);
        const style = {
            color: vars.white,
            fontWeight: 'bold',
            fontSize: 60,
            marginHorizontal: 24,
            marginVertical: 16
        };
        return (
            <Text style={style}>
                {contact.letter}
            </Text >
        );
    }

    get avatar() {
        const contact = contactStore.getContact(User.current.username);
        console.log(contact.mediumAvatarUrl);
        const uri = contact.mediumAvatarUrl;
        const size = SIZE2;
        return (
            <TouchableOpacity pressRetentionOffset={vars.retentionOffset} onPress={() => this._actionSheet.show()}>
                <Image source={{ uri, cache: 'force-cache' }} key={uri} style={{ borderRadius: size / 2, width: size, height: size, margin: 16 }} />
            </TouchableOpacity>
        );
    }

    renderThrow() {
        const contact = contactStore.getContact(User.current.username);
        const { firstName, lastName, fingerprintSkylarFormatted, username } = contact;
        const user = User.current;
        return (
            <ScrollView
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.settingsBg }}
                ref={ref => (this._scrollView = ref)}>
                <View style={[flexRow, { backgroundColor: contact.hasAvatar ? vars.txtDate : contact.color }]}>
                    {contact.hasAvatar ? this.avatar : this.avatarLetter}
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: vars.white,
                                fontSize: 16,
                                marginVertical: 4
                            }}>{firstName} {lastName}</Text>
                        <Text style={{ color: vars.white }}>@{username}</Text>
                        <View style={{ position: 'absolute', right: 0, bottom: 0, flexDirection: 'row' }}>
                            {contact.hasAvatar && icons.white('delete', () => user.deleteAvatar())}
                            {icons.white('camera-alt', () => this._actionSheet.show())}
                        </View>
                    </View>
                </View>
                <View style={{ margin: 8 }}>
                    <Text style={label}>{tx('title_name')}</Text>
                    <View style={textinputContainer}>
                        <SimpleTextBox
                            onBlur={this.submit}
                            onChangeText={text => (this.firstName = text)}
                            placeholder={tx('title_firstName')} style={textinput} value={this.firstName} />
                    </View>
                    <View style={textinputContainer}>
                        <SimpleTextBox
                            onBlur={this.submit}
                            onChangeText={text => (this.lastName = text)}
                            placeholder={tx('title_lastName')} style={textinput} value={this.lastName} />
                    </View>
                </View>
                <View style={{ margin: 8 }}>
                    <Text style={label}>{tx('title_email')}</Text>
                    {user.addresses.map(this.renderUserEmail)}
                    <View style={[textinputContainer, this.showAddEmail ? null : { height: 0 }]}>
                        {emailIcon}
                        <SimpleTextBox
                            key={user.addresses.length}
                            ref={ref => (this._addEmailBox = ref)}
                            placeholder={tx('title_email')}
                            keyboardType="email-address"
                            autoCorrect={false}
                            autoComplete={false}
                            autoCapitalize="none"
                            value={this.newEmailText}
                            onBlur={() => this.validateNewEmail()}
                            onChangeText={text => (this.newEmailText = text)}
                            onSubmitEditing={() => this.emailAction()}
                            style={textinput} />
                    </View>
                    <View style={{ marginLeft: 8, flexDirection: 'row' }}>
                        {this.emailButton}
                        {this.validationError}
                    </View>
                </View>
                <View style={{ margin: 18, marginTop: 8 }}>
                    <Text style={{ color: vars.txtDate, marginBottom: 6 }}>{t('title_publicKey')}</Text>
                    <Text style={{ color: vars.txtMedium, fontFamily: `Verdana`, fontSize: 16 }} numberOfLines={2}>
                        {fingerprintSkylarFormatted}
                    </Text>
                </View>
                <AvatarActionSheet ref={sheet => (this._actionSheet = sheet)} />
            </ScrollView>
        );
    }
}
