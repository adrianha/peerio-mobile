import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { t } from '../utils/translator';
import testLabel from '../helpers/test-label';

const itemContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: vars.spacing.small.maxi2x,
    marginBottom: vars.spacing.small.mini,
    minHeight: vars.settingsItemHeight,
    borderRadius: 4
};

const descriptionStyle = {
    color: vars.txtLightGrey,
    fontSize: vars.font.size.smaller
};

@observer
export default class BasicSettingsItem extends SafeComponent {
    press() {
        // console.log('settings-item.js: press');
        this.props.onPress && this.props.onPress();
    }

    get rightIcon() {
        return this.props.icon !== null ?
            icons.dark(this.props.icon || 'keyboard-arrow-right')
            : null;
    }

    renderThrow() {
        const { title, description, disabled, untappable, children, rightIcon } = this.props;
        const titleStyle = {
            color: disabled ? vars.txtLightGrey : vars.txtDark,
            fontSize: vars.font.size.normal
        };
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                {...testLabel(title)}
                activeOpacity={untappable ? 1 : 0.3}
                pressRetentionOffset={offset}
                onPress={() => !untappable && !disabled && this.press()}>
                <View style={itemContainerStyle} pointerEvents={untappable ? undefined : 'none'}>
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text style={titleStyle}>
                            {t(title)}
                        </Text>
                        {!!description && <Text style={descriptionStyle}>
                            {description}d
                        </Text>}
                    </View>
                    <View style={{ flex: 0 }}>
                        {children}
                    </View>
                    <View style={{ flex: 0 }}>
                        {rightIcon}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

BasicSettingsItem.propTypes = {
    children: PropTypes.any,
    title: PropTypes.any,
    description: PropTypes.any,
    disabled: PropTypes.bool,
    untappable: PropTypes.bool,
    icon: PropTypes.string,
    onPress: PropTypes.any
};
