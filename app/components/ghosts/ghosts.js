import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, ScrollView, Animated } from 'react-native';
import { MenuContext } from 'react-native-menu';
import { observable /* , reaction */ } from 'mobx';
import SafeComponent from '../shared/safe-component';
import GhostsZeroState from './ghosts-zero-state';
import ProgressOverlay from '../shared/progress-overlay';
import GhostItem from './ghost-item';
import { mailStore } from '../../lib/icebear';

@observer
export default class Ghosts extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    @observable dataSource = null;
    @observable refreshing = false;
    actionsHeight = new Animated.Value(0);

    get data() {
        return mailStore.ghosts;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    item(ghost) {
        return (
            <GhostItem key={ghost.ghostId} ghost={ghost} />
        );
    }

    listView() {
        return (
            <MenuContext>
                <ScrollView
                    initialListSize={1}
                    dataSource={this.dataSource}
                    renderRow={this.item}
                    enableEmptySections
                    ref={sv => { this.scrollView = sv; }}>
                    {this.data.map(i => this.item(i))}
                </ScrollView>
            </MenuContext>
        );
    }

    renderThrow() {
        const body = this.data.length ?
            this.listView() : !mailStore.loading && <GhostsZeroState />;

        return (
            <View
                style={{ flex: 1, flexGrow: 1 }}>
                {body}
                <ProgressOverlay enabled={mailStore.loading} />
            </View>
        );
    }
}
