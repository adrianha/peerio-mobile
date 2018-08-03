import PropTypes from 'prop-types';
import React from 'react';
import { View, SectionList, FlatList } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { topDrawerMaintenance } from '../shared/top-drawer-components';
import uiState from '../layout/ui-state';
import { vars } from '../../styles/styles';

@observer
export default class ListWithDrawer extends SafeComponent {
    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
    }

    @action.bound onShowTopDrawer() {
        uiState.showTopDrawer = true;
        this.scrollView.scrollToLocation({
            itemIndex: 0,
            sectionIndex: 0,
            viewOffset: 0,
            animated: false
        });

        // this.scrollView.scrollToLocation({
        //     itemIndex: 0,
        //     sectionIndex: 0,
        //     viewOffset: 0,
        //     animated: true
        // });
    }

    @action.bound onHideTopDrawer() {
        // this.scrollView.scrollToLocation({
        //     itemIndex: 0,
        //     sectionIndex: 0,
        //     viewOffset: -vars.topDrawerHeight,
        //     animated: true
        // });

        uiState.showTopDrawer = false;

        // this.scrollView.scrollToLocation({
        //     itemIndex: 0,
        //     sectionIndex: 0,
        //     viewOffset: 0,
        //     animated: false
        // });
    }

    renderThrow() {
        const { hasSections } = this.props;
        const listHeaderComponent = (
            <View>
                {topDrawerMaintenance(this.onShowTopDrawer, this.onHideTopDrawer)}
                {this.props.ListHeaderComponent}
            </View>
        );
        return (hasSections ?
            <SectionList {...this.props} ref={this.scrollViewRef} ListHeaderComponent={listHeaderComponent} />
            : <FlatList {...this.props} ref={this.scrollViewRef} ListHeaderComponent={listHeaderComponent} />
        );
    }
}

ListWithDrawer.PropTypes = {
    hasSections: PropTypes.bool
};
