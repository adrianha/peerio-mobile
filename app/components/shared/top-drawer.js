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
import preferenceStore from '../settings/preference-store';

const headingStyle = {
    color: vars.darkBlue,
    paddingVertical: vars.spacing.medium.mini,
    borderBottomWidth: 1,
    borderBottomColor: vars.black12,
    textAlign: 'center',
    width: '100%'
};
const imageStyle = {
    marginTop: vars.spacing.small.midi2x,
    marginBottom: vars.spacing.small.maxi2x
};
const descriptionStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.textBlack54,
    marginBottom: vars.spacing.small.midi2x,
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
    animated = new Animated.Value(-vars.topDrawerHeight);

    componentDidMount() {
        const toValue = 0;
        const duration = 400;
        this.reaction = reaction(() => (uiState.keyboardHeight > 0), () => {
            Animated.timing(this.animated, {
                toValue, duration, useNativeDriver: true
            }).start();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    @action.bound onClose() {
        preferenceStore.prefs.showTopDrawer = false;
    }

    renderThrow() {
        const { headingText, image, descriptionText, buttonText, buttonAction } = this.props;
        const container = {
            backgroundColor: 'white',
            height: vars.topDrawerHeight,
            transform: [
                { translateY: this.animated }
            ],
            alignItems: 'center',
            marginBottom: vars.spacing.small.mini2x
        };
        return preferenceStore.prefs.showTopDrawer && (uiState.keyboardHeight === 0) ? (
            <Animated.View style={container}>
                <Text semibold style={headingStyle}>{headingText}</Text>
                <View style={imageStyle}>
                    {image}
                </View>
                <Text numberOfLines={2} style={descriptionStyle}>{descriptionText}</Text>
                {buttons.blueTextButton(buttonText, buttonAction, null, null, buttonText)}
                <View style={iconStyle}>
                    {icons.darkNoPadding('close', this.onClose)}
                </View>
            </Animated.View>
        ) : null;
    }
}

TopDrawer.PropTypes = {
    headingText: PropTypes.string.isRequired,
    image: PropTypes.any.isRequired,
    descriptionText: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    buttonAction: PropTypes.func.isRequired
};

