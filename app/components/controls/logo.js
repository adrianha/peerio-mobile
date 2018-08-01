import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import Center from './center';
import { branding, vars } from '../../styles/styles';

const origWidth = 1189;
const origHeight = 472;
const width = Dimensions.get('window').width - 100;
const height = width / origWidth * origHeight;

@observer
export default class Logo extends Component {
    render() {
        const { logo } = branding;
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
                <Center style={{ marginBottom: vars.spacing.large.midi, marginTop: vars.spacing.large.maxi2x, flexGrow: 0 }}>
                    <Image testID="logo" style={{ height, width }} source={logo} />
                </Center>
            </TouchableOpacity>
        );
    }
}

Logo.propTypes = {
    onPress: PropTypes.func
};
