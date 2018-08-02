import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Clipboard, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import { getFirstLetterUpperCase, socket, telemetry } from '../../lib/icebear';
import signupState from './signup-state';
import { t, tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import LoginWizardPage, {
    header2, innerSmall, circleTopSmall, headingStyle2, buttonRowStyle, container
} from '../login/login-wizard-page';
import SignupAvatar from './signup-avatar';
import SignupAvatarActionSheet from './signup-avatar-action-sheet';
import snackbarState from '../snackbars/snackbar-state';
import testLabel from '../helpers/test-label';
import tm from '../../telemetry';
import TmHelper from '../../telemetry/helpers';

const { S } = telemetry;

const formStyle = {
    padding: vars.spacing.medium.midi2x,
    justifyContent: 'space-between'
};

const addPhotoText = {
    fontSize: vars.font.size.normal,
    color: vars.txtMedium,
    textAlign: 'center'
};

const addPhotoPlus = [addPhotoText, {
    fontSize: vars.signupFontSize,
    color: vars.white
}];

const textNormal = {
    color: vars.lighterBlackText,
    fontSize: vars.font.size.bigger,
    lineHeight: 24
};

const accountKeyText = {
    flexGrow: 1,
    flexShrink: 1,
    color: vars.lighterBlackText,
    fontSize: vars.font.size.big,
    width: 224
};

const copyBtnContainer = {
    alignSelf: 'center',
    paddingLeft: vars.spacing.small.maxi2x,
    paddingRight: vars.spacing.small.midi
};

const accountKeyRow = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const smallText = {
    fontSize: vars.font.size.smaller,
    marginVertical: vars.spacing.small.midi2x,
    color: vars.lighterBlackText
};

const accountKeyView = {
    marginVertical: vars.spacing.small.maxi
};

@observer
export default class SignupStep1 extends LoginWizardPage {
    componentDidMount() {
        TmHelper.currentRoute = S.ACCOUNT_KEY;
        this.startTime = Date.now();
    }

    componentWillUnmount() {
        tm.signup.duration(null, S.ONBOARDING, this.startTime);
    }

    get formattedAccountKey() {
        const stringLength = signupState.passphrase.length;
        const stringMiddle = Math.ceil(stringLength / 2);
        const firstLine = signupState.passphrase.substring(0, stringMiddle);
        const secondLine = signupState.passphrase.substring(stringMiddle, stringLength);
        const formatted = `${firstLine}\n${secondLine}`;

        return formatted;
    }

    copyAccountKey() {
        tm.signup.copy();
        Clipboard.setString(signupState.passphrase);
        snackbarState.pushTemporary(t('title_copied'));
    }

    get avatarPlaceholder() {
        const letter = getFirstLetterUpperCase(signupState.firstName || signupState.username);
        return (
            <View>
                <Text bold style={addPhotoPlus}>{letter}</Text>
            </View>
        );
    }

    handleBackButton() {
        tm.signup.back(S.ACCOUNT_KEY);
        signupState.prev();
    }

    handleNextButton() {
        tm.signup.next(S.ACCOUNT_KEY);
        signupState.next();
    }

    get body() {
        return (
            <View>
                <Text style={textNormal}>{t('title_helloName', { name: (signupState.firstName || signupState.username) })}</Text>
                <Text style={textNormal}>{tx('title_accountKey1')}</Text>
                <View style={accountKeyView}>
                    <Text style={smallText}>{tx('title_yourAccountKey')}</Text>
                    <View style={accountKeyRow}>
                        <Text bold {...testLabel('passphrase')} style={accountKeyText} selectable>
                            {this.formattedAccountKey}
                        </Text>
                        {buttons.blueTextButton(tx('button_copy'), this.copyAccountKey, null, null, null, copyBtnContainer)}
                    </View>
                </View>
                <Text style={textNormal}>{tx('title_accountKey2')}</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={container} onLayout={this._layout}>
                <View>
                    <View style={header2}>
                        <Text style={headingStyle2}>{tx('title_AccountKey')}</Text>
                    </View>
                    <View>
                        <View style={innerSmall}>
                            <View style={formStyle}>
                                {this.body}
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={SignupAvatarActionSheet.show}
                            pressRetentionOffset={vars.pressRetentionOffset}
                            style={[circleTopSmall, { backgroundColor: vars.txtMedium, borderWidth: 0 }]}>
                            {signupState.avatarData ? <SignupAvatar /> : this.avatarPlaceholder}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={buttonRowStyle}>
                    {this.button('button_back', this.handleBackButton)}
                    {this.button('button_next', this.handleNextButton, false, !socket.connected)}
                </View>
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
