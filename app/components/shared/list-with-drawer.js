import PropTypes from 'prop-types';
import React from 'react';
import { SectionList, FlatList } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { topDrawerMaintenance } from '../shared/top-drawer-components';

@observer
export default class ListWithDrawer extends SafeComponent {
    renderThrow() {
        const { hasSections } = this.props;
        return (hasSections ?
            <SectionList {...this.props}>
                {topDrawerMaintenance()}
                {this.props.children}
            </SectionList>
            : <FlatList {...this.props}>
                {topDrawerMaintenance()}
                {this.props.children}
            </FlatList>
        );
    }
}

ListWithDrawer.PropTypes = {
    hasSections: PropTypes.bool
};
