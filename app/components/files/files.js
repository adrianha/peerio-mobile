import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Animated } from 'react-native';
import { observable, reaction, action } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import FilesZeroStatePlaceholder from './files-zero-state-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FileUploadActionSheet from './file-upload-action-sheet';
import FileActionSheet from '../files/file-action-sheet';
import FoldersActionSheet from '../files/folder-action-sheet';
import fileState from './file-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { upgradeForFiles } from '../payments/payments';
import BackIcon from '../layout/back-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import icons from '../helpers/icons';
import ButtonText from '../controls/button-text';
import uiState from '../layout/ui-state';
import SharedFolderRemovalNotif from './shared-folder-removal-notif';
import { fileStore } from '../../lib/icebear';
import SearchBar from '../controls/search-bar';
import { ListWithDrawer } from '../shared/list-with-drawer';

const iconClear = require('../../assets/file_icons/ic_close.png');

const INITIAL_LIST_SIZE = 20;
const PAGE_SIZE = 20;

function backFolderAction() {
    fileStore.folderStore.currentFolder = fileStore.folderStore.currentFolder.parent;
}

@observer
export default class Files extends SafeComponent {
    @observable findFilesText;
    @observable refresh = 0;

    get leftIcon() {
        if (!fileStore.folderStore.currentFolder.parent) return null;
        return <BackIcon action={backFolderAction} />;
    }

    get rightIcon() {
        return !fileState.isFileSelectionMode &&
            <PlusBorderIcon
                action={() => FileUploadActionSheet.show(false, true)}
                testID="buttonUploadFileToFiles" />;
    }

    get layoutTitle() {
        if (!fileStore.folderStore.currentFolder.parent) return null;
        return fileStore.folderStore.currentFolder.name;
    }

    @observable dataSource = [];
    @observable refreshing = false;
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    actionsHeight = new Animated.Value(0);

    get data() {
        let data = fileState.store.searchQuery ?
            fileState.store.filesAndFoldersSearchResult
            : fileStore.folderStore.currentFolder.filesAndFoldersDefaultSorting;
        if (fileState.isFileSelectionMode) data = data.filter(item => !item.isLegacy);
        return data;
    }

    componentDidMount() {
        this.reactionNavigation = reaction(() => fileStore.folderStore.currentFolder,
            action(() => {
                this.maxLoadedIndex = INITIAL_LIST_SIZE;
                this.refresh++;
            }));
        this.reaction = reaction(() => [
            fileState.routerMain.route === 'files',
            fileState.routerMain.currentIndex === 0,
            this.data,
            this.data.length,
            fileState.store.searchQuery,
            this.maxLoadedIndex
        ], () => {
            console.debug(`files.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = this.data.slice(0, Math.min(this.data.length, this.maxLoadedIndex));
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
        this.reactionNavigation && this.reactionNavigation();
        this.reactionNavigation = null;
        // remove icebear hook for deletion
        fileStore.bulk.deleteFolderConfirmator = null;
    }

    onChangeFolder = folder => { fileStore.folderStore.currentFolder = folder; };

    item = ({ item, index }) => {
        // fileId for file, id for folder
        return (
            <FileItem
                key={item.fileId || item.id}
                file={item}
                rowID={index}
                onChangeFolder={this.onChangeFolder}
                onFileAction={() => FileActionSheet.show(item)}
                onFolderAction={() => FoldersActionSheet.show(item)} />
        );
    };

    onEndReached = () => {
        if (this.maxLoadedIndex <= this.data.length) this.maxLoadedIndex += PAGE_SIZE;
    };

    flatListRef = (ref) => { uiState.currentScrollView = ref; };

    keyExtractor = fsObject => fsObject ? (fsObject.fileId || fsObject.id) : null;

    list() {
        return (
            <ListWithDrawer
                keyExtractor={this.keyExtractor}
                initialNumToRender={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                data={this.dataSource}
                extraData={this.refresh}
                renderItem={this.item}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.5}
                ref={this.flatListRef}
            />
        );
    }

    get isZeroState() { return fileState.store.isEmpty; }

    get noFilesInFolder() {
        const folder = fileStore.folderStore.currentFolder;
        if (this.data.length
            || (!folder.isShared && folder.isRoot)) return null;
        const s = {
            color: vars.txtMedium,
            textAlign: 'center',
            marginTop: vars.headerSpacing
        };
        return <Text style={s}>{tx('title_noFilesInFolder')}</Text>;
    }

    onChangeFindFilesText(text) {
        const items = text.split(/[ ,;]/);
        if (items.length > 1) {
            fileState.findFilesText = items[0].trim();
            this.onSubmit();
            return;
        }
        fileState.findFilesText = text;
        this.searchFileTimeout(text);
    }

    searchFileTimeout(filename) {
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        if (!filename) {
            fileState.store.searchQuery = '';
            return;
        }
        this._searchTimeout = setTimeout(() => this.searchFile(filename), 500);
    }

    searchFile = val => {
        fileState.store.searchQuery = val;
    };

    @action.bound onChangeText(text) {
        this.clean = !text.length;
        this.onChangeFindFilesText(text);
    }

    searchTextbox() {
        const leftIcon = icons.plain('search', vars.iconSize, vars.black12);
        let rightIcon = null;
        if (fileState.findFilesText) {
            rightIcon = icons.imageButton(
                iconClear,
                () => {
                    fileState.findFilesText = '';
                    this.onChangeFindFilesText('');
                },
                null,
                vars.opacity54
            );
        }
        return (
            <SearchBar
                textValue={fileState.findFilesText}
                placeholderText={tx('title_searchAllFiles')}
                onChangeText={this.onChangeText}
                onSubmit={this.onSubmit}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            />);
    }

    toolbar() {
        const container = {
            height: vars.listItemHeight,
            backgroundColor: vars.darkBlueBackground05,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            shadowColor: '#000000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            elevation: 10,
            paddingRight: vars.spacing.small.midi2x
        };
        return (
            fileState.isFileSelectionMode && <View style={container}>
                <ButtonText
                    testID="fileShareButtonCancel"
                    onPress={this.handleExit}
                    secondary
                    text={tx('button_cancel')} />
                <ButtonText
                    testID="fileShareButtonShare"
                    onPress={this.submitSelection}
                    text={tx('button_share')}
                    disabled={!fileState.showSelection} />
            </View>
        );
    }

    handleExit() {
        fileState.exitFileSelect();
    }

    submitSelection() {
        fileState.submitSelectedFiles();
    }

    sharedFolderRemovalNotifs() {
        // TODO: add any missed conditions for when to NOT show this
        if (!fileStore.folderStore.currentFolder.isRoot) return null;
        // TODO: map them from a list of notifications from SDK
        const folderNames = [
            'test-folder-name-1',
            'test-folder-name-2',
            'test-folder-name-3',
            'test-folder-name-4'
        ];
        return <SharedFolderRemovalNotif folderNames={folderNames} />;
    }

    body() {
        if (this.data.length || !fileStore.folderStore.currentFolder.isRoot) return this.list();
        if (!this.data.length && fileState.findFilesText && !fileState.store.loading) {
            return (
                <Text style={{ marginTop: vars.headerSpacing, textAlign: 'center' }}>
                    {tx('title_noFilesMatchSearch')}
                </Text>
            );
        }
        return this.isZeroState && <FilesZeroStatePlaceholder />;
    }

    renderThrow() {
        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: vars.darkBlueBackground05 }}>
                    {!this.isZeroState && this.searchTextbox()}
                    {upgradeForFiles()}
                    {this.noFilesInFolder}
                    {/* this.sharedFolderRemovalNotifs() */}
                    {this.body()}
                </View>
                <ProgressOverlay enabled={fileState.store.loading} />
                {this.toolbar()}
            </View>
        );
    }
}
