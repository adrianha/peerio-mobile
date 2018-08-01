import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Circle from './radio-button-circle';

@observer
export default class RadioButton extends SafeComponent {
    render() {
        const { onPress, isSelected, children } = this.props;

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <Circle isSelected={isSelected} />
                    <View style={{ flex: 1 }}>
                        {children}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

RadioButton.propTypes = {
    onPress: React.PropTypes.func,
    isSelected: React.PropTypes.bool
};
