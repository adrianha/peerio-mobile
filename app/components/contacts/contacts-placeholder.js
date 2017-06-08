import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import buttons from '../helpers/buttons';
import { t } from '../utils/translator';
// import SafeComponent from '../shared/safe-component';

@observer
export default class ContactsPlaceholder extends Component {
    render() {
        const s = {
            flex: 1,
            flexGrow: 1
        };
        const inner = {
            flex: 1,
            flexGrow: 2,
            justifyContent: 'center',
            alignItems: 'center'
        };
        return (
            <View style={s}>
                <View style={inner}>
                    <Text>{t('title_importInviteText')}</Text>
                    {buttons.uppercaseBlueButton('title_importContacts')}
                </View>
                <View style={{ flex: 1, flexGrow: 3 }} />
            </View>
        );
    }
}