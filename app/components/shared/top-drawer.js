import PropTypes from 'prop-types';
import React from 'react';
import { action, reaction, observable } from 'mobx';
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
    animated = new Animated.Value(0);
    @observable hide = false;

    componentDidMount() {
        const duration = 400;
        global.testAnimated = this.animated;
        global.Animated = Animated;
        this.reaction = reaction(() => this.topDrawerVisible, visible => {
            const toValue = visible ? vars.topDrawerHeight : 0;
            Animated.timing(this.animated, {
                toValue, duration
            }).start(() => {
                this.animated.setValue(toValue);
            });
        }, true);
    }

    get topDrawerVisible() {
        return !this.hide && (uiState.keyboardHeight === 0);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    @action.bound onClose() {
        this.hide = true;
    }

    renderThrow() {
        const { heading, image, descriptionLine1, descriptionLine2, buttonText, buttonAction } = this.props;
        const outerContiner = {
            height: this.animated,
            overflow: 'hidden'
        };
        const container = {
            backgroundColor: 'white',
            alignItems: 'center',
            paddingBottom: vars.spacing.small.mini2x,
            borderBottomColor: vars.black12,
            borderBottomWidth: 1
        };
        return (
            <Animated.View style={outerContiner}>
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
            </Animated.View>
        );
    }
}

TopDrawer.PropTypes = {
    heading: PropTypes.string.isRequired,
    image: PropTypes.any,
    descriptionLine1: PropTypes.string.isRequired,
    descriptionLine2: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    buttonAction: PropTypes.func
};

