import PropTypes from 'prop-types';
import React from 'react';
import { SectionList, FlatList } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { topDrawerMaintenance } from '../shared/top-drawer';

@observer
export default class ListWithDrawer extends SafeComponent {
    renderThrow() {
        const { hasSections } = this.props;
        return (hasSections ?
            <SectionList>
                {topDrawerMaintenance()}
                {...this.props}
            </SectionList>
            : <FlatList>
                {topDrawerMaintenance()}
                {...this.props}
            </FlatList>
        );
    }
}

ListWithDrawer.PropTypes = {
    hasSections: PropTypes.bool
};
