import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    LayoutAnimation
} from 'react-native';
import state from '../layout/state';
import styles from '../../styles/styles';

export default class TextBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.blur = this.blur.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        state.focusedTextBox = null;
    }

    blur() {
        state.focusedTextBox = null;
        requestAnimationFrame(() => {
            this.setState({ focused: false });
        });
    }

    focus() {
        state.focusedTextBox = this.textinput;
        requestAnimationFrame(() => {
            this.setState({ focused: true });
        });
    }

    render() {
        const style = this.state.focused ? styles.input.active : styles.input.normal;
        let hint = this.state.focused || this.props.value && this.props.value.length ?
            styles.input.hint.scaled : styles.input.hint.full;
        return (
            <TouchableOpacity
                onPressIn={() => { this.focus(); this.textinput.focus(); }}>
                <View
                    pointerEvents="none"
                    style={style.shadow}>
                    <TextInput
                        ref={t => { this.textinput = t; }}
                        style={style.textbox}
                        value={this.props.value}
                        onFocus={this.focus}
                        onBlur={this.blur}
                        onChangeText={(text) => this.props.onChangeText(this.props.name, text)}
                        autoCorrect={false}
                    />
                    <View style={hint}>
                        <Text style={styles.input.hint.text}>
                            {this.props.hint}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

TextBox.propTypes = {
    onChangeText: React.PropTypes.func.isRequired,
    value: React.PropTypes.any.isRequired,
    hint: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
};
