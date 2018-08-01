import { BackHandler } from 'react-native';
import { when } from 'mobx';
import Router from './router';
import Login from '../login/login';
import SignupWizard from '../signup/signup-wizard';
import LayoutMain from '../layout/layout-main';
import LoadingScreen from '../layout/loading-screen';
import LoginAutomatic from '../login/login-automatic';
import PopupState from '../layout/popup-state';
import routerMain from './router-main';
import routes from './routes';
import ActionSheetLayout from '../layout/action-sheet-layout';

class RouterApp extends Router {
    constructor() {
        super();
        routes.app = this;
        this.add('loading', LoadingScreen);
        this.add('loginStart', Login.Wizard);
        this.add('signupStep1', SignupWizard);
        this.add('loginAutomatic', LoginAutomatic);
        this.add('main', LayoutMain, true);

        when(() => this.route === 'main', () => setTimeout(() => routerMain.initial(), 0));
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (ActionSheetLayout.visible) {
                ActionSheetLayout.hide();
                return true;
            }
            let blockingPopup = true;
            if (PopupState.activePopup) {
                blockingPopup = (PopupState.activePopup.type === 'systemWarning') || (PopupState.activePopup.type === 'systemUpgrade');
            }
            if (!blockingPopup) {
                PopupState.discardPopup();
                return true;
            }
            if (routes.modal.route) {
                routes.modal.discard();
                return true;
            }
            // go back from signupStep1
            if (this.route === 'signupStep1') {
                this.loginStart();
                return true;
            }
            // allow to back from main state when index is 0
            if (this.route === 'main') {
                return routes.main.androidBackHandler();
            }
            return false;
        });
    }
}

export default new RouterApp();
