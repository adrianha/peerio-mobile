import React from 'react';
import {
    View, Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { when } from 'mobx';
import { tu, tx } from '../utils/translator';
import Wizard from '../wizard/wizard';
import loginState from './login-state';
import styles, { vars } from '../../styles/styles';
import Logo from '../controls/logo';
import Layout1 from '../layout/layout1';
import migrator from '../../lib/legacy/migrator';
import { popupYes } from '../shared/popups';
import Button from '../controls/button';
import LoginStart from './login-start';
import LoginClean from './login-clean';
import LoginPassword from './login-password';

const { height } = Dimensions.get('window');
const logoHeight = height * 0.33;

@observer
export default class LoginWizard extends Wizard {
    constructor(props) {
        super(props);
        this.pages = ['loginStart', 'loginClean', 'loginPassword'];
    }

    loginStart() {
        return <LoginStart login={() => this.index++} />;
    }

    loginClean() {
        return <LoginClean submit={() => this.index++} />;
    }

    loginPassword() {
        return <LoginPassword submit={() => loginState.login()} />;
    }

    footer() {
        const s = styles.wizard.footer.button.base;
        return (this.index > 0) && (
            <View>
                <Button style={s} onPress={() => (this.index--)} text={tu('back')} />
            </View>
        );
    }

    componentDidMount() {
        const load = __DEV__ && process.env.PEERIO_SKIPLOGINLOAD ? Promise.resolve(true) : loginState.load();
        load.then(() => {
            if (__DEV__) {
                when(() => loginState.isConnected, () => {
                    loginState.username = process.env.PEERIO_USERNAME;
                    loginState.passphrase = process.env.PEERIO_PASSPHRASE;
                    process.env.PEERIO_AUTOLOGIN && loginState.login();
                });
            }
        });
        // migrator.run().then(keys =>
        //     popupYes(tx('popup_legacyMasterPassword'),
        // tx('popup_legacyWriteDown'), JSON.parse(keys).secretKey))
        //     .catch(() => {});
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View
                style={[style.containerFlex, { height }]}>
                <View style={{ height: logoHeight, justifyContent: 'center' }}>
                    <Logo />
                </View>
                {this.wizard()}
                {this.footerContainer()}
            </View>
        );
        return <Layout1 body={body} footer={null} />;
    }
}