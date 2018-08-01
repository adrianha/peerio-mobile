import React from 'react';
import { View } from 'react-native';
import { observable, action, when } from 'mobx';
import Text from '../controls/custom-text';
import { t, tx } from '../utils/translator';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import LoginWizardPage, {
    row, container, headingStyle1, subHeadingStyle, footerContainer, footerText1, footerText2
} from './login-wizard-page';
import { vars } from '../../styles/styles';
import DebugMenuTrigger from '../shared/debug-menu-trigger';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import uiState from '../layout/ui-state';

const { validators } = validation;
const { usernameLogin } = validators;

const inner2 = {
    borderRadius: 4,
    backgroundColor: vars.white,
    justifyContent: 'center',
    minHeight: 300
};

const formStyle = {
    paddingVertical: vars.spacing.medium.midi2x,
    justifyContent: 'space-between'
};

const findKeyText = {
    alignSelf: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size.normal
};

export default class LoginClean extends LoginWizardPage {
    usernameState = observable({ value: '' });
    passwordState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound passwordInputRef(ref) { this.passwordInput = ref; }

    componentDidMount() {
        if (__DEV__ && process.env.PEERIO_USERNAME && process.env.PEERIO_PASSPHRASE) {
            when(() => loginState.isConnected, () => {
                this.usernameInput.onChangeText(process.env.PEERIO_USERNAME);
                this.passwordInput.onChangeText(process.env.PEERIO_PASSPHRASE);
                process.env.PEERIO_AUTOLOGIN && this.submit();
            });
        }
    }

    @action.bound submit() {
        loginState.username = this.usernameState.value;
        loginState.passphrase = this.passwordState.value;
        uiState.hideAll()
            .then(() => loginState.login())
            .catch(e => {
                let errorMessage = 'error_wrongAK';
                if (e.deleted || e.blacklisted) {
                    errorMessage = 'error_accountSuspendedTitle';
                }
                this.passwordInput.setCustomError(tx(errorMessage));
            });
    }

    get isNextDisabled() {
        return socket.connected && (!this.passwordState.value ||
            !this.passwordInput.isValid || !this.usernameInput.isValid);
    }

    render() {
        return (
            <View style={container}>
                <DebugMenuTrigger>
                    <View style={{ justifyContent: 'center' }}>
                        <Text semibold style={[headingStyle1, { marginBottom: vars.spacing.large.midi }]}>
                            {t('title_welcome')}
                        </Text>
                        <Text style={[subHeadingStyle, { marginBottom: vars.spacing.medium.midi }]}>
                            {t('title_login')}
                        </Text>
                    </View>
                </DebugMenuTrigger>
                <View>
                    <View style={inner2}>
                        <View style={formStyle}>
                            <StyledTextInput
                                state={this.usernameState}
                                validations={usernameLogin}
                                hint={tx('title_username')}
                                ref={this.usernameInputRef}
                                lowerCase
                                testID="usernameLogin"
                            />
                            <StyledTextInput
                                state={this.passwordState}
                                hint={tx('title_AccountKey')}
                                onSubmit={this.submit}
                                secureText
                                returnKeyType="go"
                                ref={this.passwordInputRef}
                                testID="usernamePassword"
                            />
                            <Text style={findKeyText}>{tx('title_whereToFind')}</Text>
                        </View>
                    </View>
                    <View style={[row, { justifyContent: 'flex-end' }]}>
                        {this.button(
                            'button_login',
                            this.submit,
                            loginState.isInProgress,
                            this.isNextDisabled)}
                    </View>
                </View>
                <View style={footerContainer}>
                    <Text style={footerText1}>
                        {tx('title_createNewAccount')}
                    </Text>
                    <Text style={footerText2}>
                        {tx('title_signupLink')}
                    </Text>
                    <Text style={footerText1}>
                        {tx('title_here')}
                    </Text>
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
