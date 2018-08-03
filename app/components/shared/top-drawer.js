import PropTypes from 'prop-types';
import React from 'react';
import { action, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Animated } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from './safe-component';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import icons from '../helpers/icons';
import { uiState } from '../states';

const headingStyle = {
    color: vars.darkBlue,
    paddingVertical: vars.spacing.medium.mini,
    borderBottomWidth: 1,
    borderBottomColor: vars.black12,
    textAlign: 'center',
    width: '100%'
};
const descriptionContainer = {
    marginBottom: vars.spacing.small.midi2x,
    width: '100%'
};
const descriptionStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.textBlack54,
    paddingHorizontal: vars.spacing.huge.mini2x,
    textAlign: 'center',
    width: '100%'
};
const iconStyle = {
    position: 'absolute',
    top: vars.spacing.small.maxi2x,
    right: vars.spacing.medium.mini2x
};

@observer
export default class TopDrawer extends SafeComponent {
    animatedValue = new Animated.Value(0);

    componentDidMount() {
        this.reaction = reaction(() => uiState.topDrawerVisible, visible => {
            if (visible) setTimeout(() => this.props.onShowTopDrawer(), 1000);
            else setTimeout(() => this.props.onHideTopDrawer(), 1000);
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    @action.bound onClose() {
        uiState.topDrawerDismissed = true;
    }

    renderThrow() {
        const { heading, image, descriptionLine1, descriptionLine2, buttonText, buttonAction } = this.props;
        if (!uiState.showTopDrawer) return null;
        const container = {
            backgroundColor: 'white',
            alignItems: 'center',
            paddingBottom: vars.spacing.small.mini2x,
            borderBottomColor: vars.black12,
            borderBottomWidth: 1
        };
        return (
            <View style={{ overflow: 'hidden' }}>
                <View style={container}>
                    <Text semibold style={headingStyle}>{heading}</Text>
                    {image}
                    <View style={descriptionContainer}>
                        <Text numberOfLines={2} style={descriptionStyle}>{descriptionLine1}</Text>
                        {descriptionLine2 && <Text numberOfLines={1} style={descriptionStyle}>{descriptionLine2}</Text>}
                    </View>
                    {buttons.blueTextButton(buttonText, buttonAction, null, null, buttonText)}
                    <View style={iconStyle}>
                        {icons.darkNoPadding('close', this.onClose)}
                    </View>
                </View>
            </View>
        );
    }
}

TopDrawer.PropTypes = {
    heading: PropTypes.string.isRequired,
    image: PropTypes.any.isRequired,
    descriptionLine1: PropTypes.string.isRequired,
    descriptionLine2: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    buttonAction: PropTypes.func,
    onShowTopDrawer: PropTypes.any,
    onHideTopDrawer: PropTypes.any
};
