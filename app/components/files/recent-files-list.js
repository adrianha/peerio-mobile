import React from 'react';
import { observer } from 'mobx-react/native';
import { SectionList, View } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import ChatInfoSectionHeader from '../messaging/chat-info-section-header';
import RecentFileItem from '../files/recent-file-item';
import fileState from '../files/file-state';
import FilesActionSheet from '../files/files-action-sheet';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 10;

@observer
export default class RecentFilesList extends SafeComponent {
    dataSource = [];

    get data() { return chatState.currentChat.recentFiles; }

    get hasData() {
        return this.dataSource[0] && this.dataSource[0].data.length;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            this.dataSource = [{ data: this.data.slice(), key: tx('title_recentFiles') }];
            this.forceUpdate();
        }, true);
    }

    item = ({ item }) => {
        if (chatState.collapseFirstChannelInfoList) return null;
        const fileId = item;
        const file = fileState.store.getById(fileId);
        if (!file) return null;
        // TODO: replace with getOrMake pattern
        // for event handler
        return (
            <RecentFileItem
                onMenu={() => this.filesActionSheet.show(file)}
                key={fileId}
                file={file}
                isRecentFile />
        );
    };

    header({ section: { key } }) {
        return (<ChatInfoSectionHeader
            key={key}
            title={key}
            collapsible={chatState.currentChat.isChannel}
            isSecondList />);
    }

    filesActionSheetRef = (ref) => { this.filesActionSheet = ref; };

    renderThrow() {
        return (
            <View>
                <SectionList
                    initialNumToRender={INITIAL_LIST_SIZE}
                    sections={this.dataSource}
                    keyExtractor={fileId => fileId}
                    renderItem={this.item}
                    renderSectionHeader={this.hasData ? this.header : null}
                    style={{ marginBottom: 8 }}
                />
                <FilesActionSheet
                    ref={this.filesActionSheetRef} />
            </View>
        );
    }
}
