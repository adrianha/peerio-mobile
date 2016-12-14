import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { tu } from '../utils/translator';
import Button from '../controls/button';
import Center from '../controls/center';
import signupState from '../signup/signup-state';
import loginState from '../login/login-state';

@observer
export default class LoginSignup extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }

    signUp() {
        if (loginState.isInProgress) return;
        signupState.transition();
    }

    login() {
        loginState.login();
    }

    render() {
        console.log(`login-signup.js: ${loginState.isConnected}`);
        const bStyle = {
            padding: 24
        };
        const textStyle = {
            fontWeight: 'bold'
        };
        return (
            <Center>
                <Button
                    testID="signupButton"
                    style={bStyle}
                    disabled={!loginState.isConnected}
                    textStyle={textStyle}
                    text={tu('signup')}
                    onPress={this.signUp} />
                <Button
                    testID="loginButton"
                    style={bStyle}
                    disabled={!loginState.isConnected}
                    textStyle={textStyle}
                    text={tu('login')}
                    onPress={this.login} />
            </Center>
        );
    }
}
