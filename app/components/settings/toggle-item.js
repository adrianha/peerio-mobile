import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import BasicSettingsItem from './basic-settings-item';
import Toggle from './toggle';

@observer
export default class ToggleItem extends SafeComponent {
    get active() {
        return this.props.reverse ?
            !this.props.state[this.props.prop]
            : this.props.state[this.props.prop];
    }

    toggle = () => {
        const { onPress } = this.props;
        onPress && onPress(!this.active);
    };

    renderThrow() {
        return (
            <BasicSettingsItem
                {...this.props}
                untappable icon={null}>
                <Toggle onPress={this.toggle} active={this.active} />
            </BasicSettingsItem>
        );
    }
}

ToggleItem.propTypes = {
    state: PropTypes.any,
    prop: PropTypes.any,
    title: PropTypes.any,
    description: PropTypes.any,
    onPress: PropTypes.any
};

