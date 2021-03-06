import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import chatState from '../messaging/chat-state';
import routerMain from '../routes/router-main';
import { helpers, vars } from '../../styles/styles';

@observer
export default class MessageIcon extends SafeComponent {
    @observable unread = false;
    lastCount = 0;
    componentDidMount() {
        reaction(() => chatState.unreadMessages, count => {
            // console.log(`message-icon.js: unread count ${count}`);
            this.unread = count >= this.lastCount;
            this.lastCount = count;
        });
    }

    press() {
        this.unread = false;
        routerMain.toggleLeftMenu();
    }

    renderThrow() {
        const dotStyle = {
            left: -4,
            top: -8,
            backgroundColor: vars.redWarning,
            opacity: this.unread ? 1 : 0
        };

        return (
            <TouchableOpacity onPress={() => this.press()}>
                <View style={{
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginRight: vars.spacing.medium.mini2x,
                    paddingLeft: vars.spacing.medium.mini2x,
                    width: 56,
                    height: 56
                }}>
                    {icons.plainWhite('menu')}
                    <View style={[helpers.circle(10), dotStyle]} />
                </View>
            </TouchableOpacity>
        );
    }
}
