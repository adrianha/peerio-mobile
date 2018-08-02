import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image } from 'react-native';
import { action } from 'mobx';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import contactState from '../contacts/contact-state';
import signupState from './signup-state';
import LoginWizardPage, {
    header2, innerSmall, circleTopSmall, headingStyle2, container, topCircleSizeSmall
} from '../login/login-wizard-page';
import { formStyle, titleDark, textNormal } from '../../styles/signup-contact-sync';
import { popupContactPermission } from '../shared/popups';
import { clientApp } from '../../lib/icebear';

const imageDiscoverNetwork = require('../../assets/discover-network.png');

@observer
export default class SignupContactSyncStart extends LoginWizardPage {
    get icon() {
        const width = topCircleSizeSmall * 2;
        const height = width;
        return (
            <View style={[circleTopSmall, { borderWidth: 0 }]}>
                <Image
                    source={imageDiscoverNetwork}
                    style={{ width, height }} />
            </View>
        );
    }

    @action.bound async syncContacts() {
        const hasPermissions =
            await popupContactPermission(tx('title_permissionContacts'), tx('title_permissionContactsDescroption'))
            && await contactState.hasPermissions();
        if (hasPermissions) {
            // user has chosen to auto import contacts
            clientApp.uiUserPrefs.importContactsInBackground = true;
            signupState.next();
        } else {
            // user has not given permission to access contacts
            clientApp.uiUserPrefs.importContactsInBackground = false;
            signupState.finishSignUp();
        }
    }

    render() {
        return (
            <View style={container} onLayout={this._layout}>
                <View style={header2}>
                    <Text semibold style={headingStyle2}>{tx('title_discoverNetwork')}</Text>
                </View>
                <View style={{ flex: 0.7, flexGrow: 1 }}>
                    <View style={innerSmall}>
                        <View style={formStyle}>
                            <Text semibold style={titleDark}>{tx('title_findYourContacts')}</Text>
                            <Text style={textNormal}>{tx('title_findYourContactsDescription')} </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            {buttons.roundBlueBgButton(tx('title_syncContacts'), () => this.syncContacts())}
                        </View>
                    </View>
                    {this.icon}
                </View>
                <View style={{ flexDirection: 'row', height: 90, justifyContent: 'flex-end' }}>
                    {this.button('button_skip', () => signupState.finishSignUp())}
                </View>
            </View>
        );
    }
}
