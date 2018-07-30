import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions, Image, LayoutAnimation } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import TextInputStateful from '../controls/text-input-stateful';
import testLabel from '../helpers/test-label';

const image = require('../../assets/2fa-illustration.png');

const { width } = Dimensions.get('window');
const imageWidth = width - (2 * vars.popupHorizontalMargin);
const headingStyle = {
    fontSize: vars.font.size.big,
    marginBottom: vars.spacing.medium.mini2x,
    color: vars.textBlack87
};

const imageStyle = {
    marginTop: -1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: imageWidth,
    height: imageWidth / 1.86 // image ratio
};
const inputContainer = {
    height: vars.inputHeight,
    minWidth: vars.tfaInputWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vars.spacing.large.midixx,
    marginBottom: vars.spacing.large.maxi2x
};
const style = {
    height: vars.inputHeight,
    width: vars.tfaInputWidth,
    textAlign: 'center'
};

@observer
export default class TwoFactorAuthPrompt extends SafeComponent {
    @observable focused = false;

    @action.bound focus() {
        LayoutAnimation.easeInEaseOut();
        this.focused = true;
    }

    @action.bound blur() {
        LayoutAnimation.easeInEaseOut();
        this.focused = false;
    }

    renderThrow() {
        const { placeholder, state, title, checkbox, onSubmitEditing } = this.props;
        return (
            <View style={{ minHeight: vars.popupMinHeight }}>
                {!this.focused && <Image source={image} style={imageStyle} resizeMode="contain" />}
                <View style={{ paddingHorizontal: vars.popupPadding, paddingTop: vars.spacing.medium.maxi }}>
                    <Text bold style={headingStyle}>{tx(title)}</Text>
                    <Text style={{ color: vars.textBlack87 }}>{tx('title_2FADetail')}</Text>
                    <View style={inputContainer}>
                        <TextInputStateful
                            returnKeyType="go"
                            {...testLabel('2faTokenInput')}
                            {...{ placeholder, state, style, onSubmitEditing }}
                            onFocus={this.focus}
                            onBlur={this.blur} />
                    </View>
                    {checkbox}
                </View>
            </View>
        );
    }
}
