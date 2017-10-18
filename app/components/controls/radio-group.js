import React from 'react';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import RadioButton from './radio-button';
import { tx } from '../utils/translator';

const radioText = {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 4
};

export default class RadioGroup extends SafeComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1
        };
    }

    _onSelect(index) {
        const { onSelect } = this.props;
        this.setState({
            selectedIndex: index
        });
        onSelect(index);
    }

    render() {
        const { selectedIndex } = this.state;
        const targetIndex = selectedIndex !== -1 ? selectedIndex : this.props.defaultSelect;

        const views = this.props.options.map((text, index) =>
            (<RadioButton
                key={text}
                onPress={() => this._onSelect(index)}
                isSelected={index === targetIndex}
                >
                <View style={radioText} >
                    <Text>{tx(text)}</Text>
                </View>
            </RadioButton>
            ),
        );

        return (
            <View>
                {views}
            </View>
        );
    }
}

RadioGroup.propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    defaultSelect: React.PropTypes.number,
    optionTitles: React.PropTypes.any
};

RadioGroup.defaultProps = {
    defaultSelect: -1
};
