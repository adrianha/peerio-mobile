import PropTypes from 'prop-types';
import React from 'react';
import { View, SectionList, FlatList } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { topDrawerMaintenance } from '../shared/top-drawer-components';

@observer
export default class ListWithDrawer extends SafeComponent {
    renderThrow() {
        const { hasSections } = this.props;
        const listHeaderComponent = (
            <View>
                {topDrawerMaintenance()}
                {this.props.ListHeaderComponent}
            </View>
        );
        return (hasSections ?
            <SectionList {...this.props} ListHeaderComponent={listHeaderComponent}>
                {this.props.children}
            </SectionList>
            : <FlatList {...this.props} ListHeaderComponent={listHeaderComponent}>
                {this.props.children}
            </FlatList>
        );
    }
}

ListWithDrawer.PropTypes = {
    hasSections: PropTypes.bool
};
