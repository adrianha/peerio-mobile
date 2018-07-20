import React from 'react';
import { observer } from 'mobx-react/native';
import { View, StatusBar, Animated, Dimensions } from 'react-native';
import { reaction, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import uiState from './ui-state';
import InputMainContainer from './input-main-container';
import Bottom from '../controls/bottom';
import HeaderMain from './header-main';
import TabContainer from './tab-container';
import SnackBar from '../snackbars/snackbar';
import SnackBarConnection from '../snackbars/snackbar-connection';
import ProgressOverlay from '../shared/progress-overlay';
// import snackbarState from '../snackbars/snackbar-state';
import Fab from '../shared/fab';
import { common } from '../../styles/styles';
import routerMain from '../routes/router-main';
import routerModal from '../routes/router-modal';
import CustomOverlay from './custom-overlay';
import MockTopDrawer from '../mocks/mock-top-drawer';

const { height } = Dimensions.get('window');

@observer
export default class LayoutMain extends SafeComponent {
    @observable modalVisible = false;

    componentDidMount() {
        reaction(() => uiState.appState, () => this.forceUpdate());
    }

    get isFabVisible() {
        return routerMain.currentComponent && routerMain.currentComponent.isFabVisible;
    }

    get fab() {
        const style = {
            position: 'absolute',
            right: 0,
            bottom: this.isFabVisible ? 0 : -height,
            paddingBottom: this._snackBar ? this._snackBar.animatedHeight : 0
        };
        return (
            <Animated.View
                style={style}>
                <Fab />
            </Animated.View>
        );
    }

    get snackBar() {
        return !this.modal && !routerMain.currentComponent.suppressMainSnackBar ?
            <SnackBar ref={sb => { this._snackBar = sb; }} /> : null;
    }

    renderThrow() {
        const outerStyle = {
            backgroundColor: '#fff',
            flex: 1,
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: global.platform === 'android' ? 0 : uiState.keyboardHeight
        };

        const { pages, currentComponent } = routerMain;
        const currentPage = pages[routerMain.currentIndex];
        const { actionsBar, showInput, leftIcon, rightIcon, layoutTitle } = currentComponent;

        const animatedBlock = (
            <View
                style={outerStyle}>
                <HeaderMain leftIcon={leftIcon} rightIcon={rightIcon} title={layoutTitle} />
                <SnackBarConnection />
                <View
                    style={{ flex: 1, flexGrow: 1 }}>
                    <MockTopDrawer />
                    {currentPage}
                    <Bottom>
                        <CustomOverlay />
                        {this.snackBar}
                    </Bottom>
                </View>
                {showInput && <InputMainContainer />}
                {this.fab}
                {actionsBar || <TabContainer />}
            </View>
        );
        return (
            <View
                testID="mainLayout"
                style={[common.container.root]}>
                {animatedBlock}
                <ProgressOverlay enabled={routerMain.loading} />
                <StatusBar
                    barStyle={uiState.externalViewer || routerModal.isBlackStatusBar ? 'default' : 'light-content'}
                    hidden={false} />
            </View>
        );
    }
}
