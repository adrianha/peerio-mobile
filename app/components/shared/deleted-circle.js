import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';
import SafeComponent from '../shared/safe-component';

const diameter = 18;

@observer
export default class DeletedCircle extends SafeComponent {
    renderThrow() {
        if (!this.props.visible) return null;
        const ratio = this.props.large ? 2 : 1;
        const width = diameter * ratio;
        const height = width;
        const color1 = 'red';
        const color2 = 'white';
        const borderColor = this.props.invert ? color1 : color2;
        const backgroundColor = this.props.invert ? color2 : color1;
        const tofuStyle = {
            width,
            height,
            borderRadius: width / 2,
            borderColor,
            borderWidth: 1,
            backgroundColor,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center'
        };
        const containerStyle = {
            position: 'absolute',
            right: 0,
            top: 0
        };
        return (
            <View style={containerStyle}>
                <View style={tofuStyle}>
                    <Text style={{ color: borderColor, fontSize: 10 * ratio, fontWeight: 'bold' }}>-</Text>
                </View>
            </View>
        );
    }
}

DeletedCircle.propTypes = {
    onPress: PropTypes.func,
    visible: PropTypes.bool,
    large: PropTypes.bool,
    invert: PropTypes.bool
};
