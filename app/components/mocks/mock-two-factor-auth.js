import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import { User } from '../../lib/icebear';
import chatState from '../messaging/chat-state';
import mockChatStore from './mock-chat-store';
import HeaderMain from '../layout/header-main';
// import TwoFactorAuth from '../settings/two-factor-auth';
// import TwoFactorAuthCodes from '../settings/two-factor-auth-codes';
import TwoFactorAuthCodesGenerate from '../settings/two-factor-auth-codes-generate';

@observer
export default class MockTwoFactorAuth extends Component {
    componentDidMount() {
        User.current = {};
        chatState.store = mockChatStore;
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <HeaderMain title="Two-factor authentication" />
                <TwoFactorAuthCodesGenerate />
                <PopupLayout key="popups" />
                <StatusBar barStyle="light-content" />
            </View>
        );
    }
}
