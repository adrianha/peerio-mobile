import React from 'react';
import { observer } from 'mobx-react/native';
import { View, LayoutAnimation, SectionList } from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import { observable, reaction, action, computed } from 'mobx';
import { chatInviteStore, chatStore } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import ChatListItem from './chat-list-item';
import ChannelListItem from './channel-list-item';
import ProgressOverlay from '../shared/progress-overlay';
import chatState from './chat-state';
import ChatSectionHeader from './chat-section-header';
import ChannelInviteListItem from './channel-invite-list-item';
import PlusBorderIcon from '../layout/plus-border-icon';
import CreateActionSheet from './create-action-sheet';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';
// import { scrollHelper } from '../helpers/test-helper';
import UnreadMessageIndicator from './unread-message-indicator';
import { vars } from '../../styles/styles';
import ChatZeroStatePlaceholder from './chat-zero-state-placeholder';
import TopDrawer from '../shared/top-drawer';
import icons from '../helpers/icons';

const INITIAL_LIST_SIZE = 10;

const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 100
};

@observer
export default class ChatList extends SafeComponent {
    @observable reverseRoomSorting = false;
    @observable minSectionIndex = null;
    @observable minItemIndex = null;
    @observable maxSectionIndex = null;
    @observable maxItemIndex = null;
    @observable enableIndicators = false;

    get rightIcon() {
        return (<PlusBorderIcon
            action={CreateActionSheet.show}
            testID="buttonCreateNewChat" />);
    }

    get dataSource() {
        return [
            { title: 'title_channels', index: 0, data: this.firstSectionItems },
            { title: 'title_directMessages', index: 1, data: this.secondSectionItems }
        ];
    }

    @computed get firstSectionItems() {
        const allChannels = chatStore.allRooms || [];
        allChannels.sort((a, b) => {
            const first = (a.name || a.channelName || '').toLocaleLowerCase();
            const second = (b.name || b.channelName || '').toLocaleLowerCase();
            const result = first.localeCompare(second);
            return this.reverseRoomSorting ? !result : result;
        });
        return allChannels;
    }

    @computed get secondSectionItems() {
        return chatState.store.chats.filter(d => !d.isChannel).slice();
    }

    componentDidMount() {
        uiState.testAction1 = () => {
            this.reverseRoomSorting = !this.reverseRoomSorting;
        };

        this.indicatorReaction = reaction(() => [
            this.topIndicatorVisible,
            this.bottomIndicatorVisible
        ], () => {
            LayoutAnimation.easeInEaseOut();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
        this.indicatorReaction && this.indicatorReaction();
        this.indicatorReaction = null;
        uiState.currentScrollView = null;
    }

    get sectionTitles() {
        return ['title_channels', 'title_directMessages'];
    }

    sectionHeader = (item) => {
        const { data, title } = item.section;
        const i = (t, component) => {
            const r = {};
            r[t] = component;
            return r;
        };
        const titleComponents = this.sectionTitles.map(sectionTitle => {
            return { ...i(sectionTitle, <ChatSectionHeader title={tx(sectionTitle)} />) };
        });

        const titles = Object.assign({}, ...titleComponents);
        return data && data.length ? titles[title] : null;
    };

    keyExtractor(item) {
        return item.kegDbId || item.id || item.title;
    }

    inviteItem = (chat) => <ChannelInviteListItem id={chat.kegDbId} chat={chat} channelName={chat.channelName} />;
    channelItem = (chat) => <ChannelListItem chat={chat} channelName={chat.name} />;
    dmItem = (chat) => <ChatListItem key={chat.id} chat={chat} />;

    renderChatItem = (chat) => {
        if (chat.kegDbId) return this.inviteItem(chat);
        if (chat.isChannel) return this.channelItem(chat);

        return this.dmItem(chat);
    };

    item = (item) => {
        const chat = item.item;
        if (!chat.id && !chat.kegDbId && !chat.spaceId) return null;

        return this.renderChatItem(chat);
    };

    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
        // this is needed to reset viewable items indicator at initial render
        setTimeout(() => this.scrollView && this.scrollView.scrollToLocation({
            itemIndex: -1,
            sectionIndex: 0,
            viewPosition: 0
        }), 500);
        setTimeout(() => { this.enableIndicators = true; }, 1000);
    }

    @computed get firstUnreadItemPosition() {
        for (const { data, index } of this.dataSource) {
            const itemIndex = data.findIndex(f => !!f.unreadCount);
            if (itemIndex !== -1) return { section: index, index: itemIndex };
        }
        return null;
    }

    @computed get lastUnreadItemPosition() {
        for (let j = this.dataSource.length - 1; j >= 0; --j) {
            const { data, index } = this.dataSource[j];
            for (let i = data.length - 1; i >= 0; --i) {
                if (data[i].unreadCount) return { section: index, index: i };
            }
        }
        return null;
    }

    @computed get topIndicatorVisible() {
        if (!this.enableIndicators) return false;
        // if view hasn't been updated with viewable range
        if (this.minSectionIndex === null) return false;
        const pos = this.firstUnreadItemPosition;
        if (!pos) return false;
        if (pos.section < this.minSectionIndex) return true;
        if (pos.section === this.minSectionIndex) return pos.index < this.minItemIndex - 1;
        return false;
    }

    @computed get bottomIndicatorVisible() {
        if (!this.enableIndicators) return false;
        // if view hasn't been updated with viewable range
        if (this.maxSectionIndex === null) return false;
        const pos = this.lastUnreadItemPosition;
        if (!pos) return false;
        if (pos.section > this.maxSectionIndex) return true;
        if (pos.section === this.maxSectionIndex) return pos.index > this.maxItemIndex;
        return false;
    }

    /**
     * Scrolls to the topmost unread item in the list
     */
    @action.bound scrollUpToUnread() {
        const pos = this.firstUnreadItemPosition;
        if (!pos) return;
        this.scrollView.scrollToLocation({
            itemIndex: pos.index,
            sectionIndex: pos.section,
            viewPosition: 0
        });
    }

    /**
     * Scrolls to the bottommost unread item in the list
     */
    @action.bound scrollDownToUnread() {
        const pos = this.lastUnreadItemPosition;
        if (!pos) return;
        this.scrollView.scrollToLocation({
            itemIndex: pos.index,
            sectionIndex: pos.section,
            viewPosition: 0.9
        });
    }

    /**
     * Whenever there is a scroll event which changes viewable items
     * This property handler gets called
     * @param {*} data
     */
    @action.bound onViewableItemsChanged(data) {
        let minSectionIndex = Number.MAX_SAFE_INTEGER;
        let minItemIndex = Number.MAX_SAFE_INTEGER;
        let maxSectionIndex = -1;
        let maxItemIndex = -1;
        data.viewableItems.forEach(i => {
            const itemIndex = i.index;
            const sectionIndex = i.section.index;
            if (sectionIndex < minSectionIndex
                || (sectionIndex === minSectionIndex && itemIndex < minItemIndex)) {
                minSectionIndex = sectionIndex;
                // section headers have zero item index so there's a workaround
                minItemIndex = itemIndex || 0;
            }
            if (sectionIndex > maxSectionIndex
                || (sectionIndex === maxSectionIndex && itemIndex > maxItemIndex)) {
                maxSectionIndex = sectionIndex;
                // section headers have zero item index so there's a workaround
                maxItemIndex = itemIndex || 0;
            }
        });
        Object.assign(this, { minSectionIndex, minItemIndex, maxSectionIndex, maxItemIndex });
    }

    getItemLayout = sectionListGetItemLayout({
        // first section is channels
        // second section is DMs
        getItemHeight: (rowData, sectionIndex /* , rowIndex */) => sectionIndex === 0 ?
            vars.chatListItemHeight : vars.chatListItemDMHeight,
        getSectionHeaderHeight: () => vars.chatListItemHeight
    });

    get topDrawer() {
        return (<TopDrawer
            headingText="Heading"
            image={icons.imageIcon(require('../../assets/info-icon.png'), vars.iconSizeMedium2x)}
            descriptionText="Max 2 lines. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            buttonText="ButtonText"
        />);
    }

    listView() {
        if (chatState.routerMain.currentIndex !== 0) return null;
        return (
            <SectionList
                style={{ flexGrow: 1 }}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
                enableEmptySections
                ref={this.scrollViewRef}
                onViewableItemsChanged={this.onViewableItemsChanged}
                getItemLayout={this.getItemLayout}
                stickySectionHeadersEnabled={false}
                keyExtractor={this.keyExtractor}
                viewabilityConfig={viewabilityConfig}
                ListHeaderComponent={this.topDrawer}
                // {...scrollHelper} TODO removed temporarily because it breaks unread message indicator
            />
        );
    }

    zeroStatePlaceholder() {
        return <ChatZeroStatePlaceholder />;
    }

    renderThrow() {
        const body = ((chatStore.chats.length || chatInviteStore.received.length) && chatState.store.loaded) ?
            this.listView() : this.zeroStatePlaceholder();

        return (
            <View style={{ flexGrow: 1, flex: 1 }}>
                <View style={{ flexGrow: 1, flex: 1 }}>
                    {body}
                </View>
                {this.topIndicatorVisible && <UnreadMessageIndicator isAlignedTop action={this.scrollUpToUnread} />}
                {this.bottomIndicatorVisible && <UnreadMessageIndicator action={this.scrollDownToUnread} />}
                <ProgressOverlay enabled={chatState.store.loading} />
            </View>
        );
    }
}
