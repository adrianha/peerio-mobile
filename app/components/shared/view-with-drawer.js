import React from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { topDrawerMaintenance } from '../shared/top-drawer-components';

@observer
export default class ViewWithDrawer extends SafeComponent {
    renderThrow() {
        return (
            <ScrollView {...this.props}>
                {topDrawerMaintenance()}
                {this.props.children}
            </ScrollView>);
    }
}
