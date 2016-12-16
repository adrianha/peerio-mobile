import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import mainState from '../main/main-state';
import styles, { vars } from '../../styles/styles';
import MessageIcon from './message-icon';
import BackIcon from './back-icon';

@observer
export default class HeaderMain extends Component {
    constructor(props) {
        super(props);
        this.leftMenu = this.leftMenu.bind(this);
        this.rightMenu = this.rightMenu.bind(this);
    }

    leftMenu() {
        mainState.toggleLeftMenu();
    }

    rightMenu() {
        mainState.toggleRightMenu();
    }

    search() {
    }

    back() {
        mainState.back();
    }

    render() {
        const leftIcon = mainState.isBackVisible ?
            <BackIcon /> : <MessageIcon />;
        const textStyle = {
            color: vars.white,
            fontWeight: vars.font.weight.regular,
            flex: 1,
            fontSize: 16,
            alignItems: 'center',
            marginLeft: 20
        };
        const containerStyle = {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: vars.statusBarHeight,
            height: vars.headerHeight
        };
        return (
            <View style={{
                height: vars.headerSpacing,
                flex: 0,
                justifyContent: 'flex-end',
                paddingBottom: 6,
                backgroundColor: styles.branding.peeriomobile.bg
            }}>
                <View style={containerStyle}>
                    {leftIcon}
                    <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={textStyle}>{this.props.title}</Text>
                    <View style={{ backgroundColor: 'transparent' }}>
                        {icons.white('more-vert', this.rightMenu)}
                    </View>
                </View>
            </View>
        );
    }
}

HeaderMain.propTypes = {
    title: React.PropTypes.string
};
