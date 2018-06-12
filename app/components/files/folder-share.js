import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { Keyboard, LayoutAnimation, View } from 'react-native';
import { observer } from 'mobx-react/native';
import ContactSelectorUniversal from '../contacts/contact-selector-universal';
import ContactEditPermission from '../contacts/contact-edit-permission';
import SharedFolderFooter from './shared-folder-footer';
import { vars } from '../../styles/styles';
import { fileState } from '../states';
import routes from '../routes/routes';

@observer
export default class FolderShare extends Component {
    @observable currentPage = 0;

    @action.bound exit() {
        routes.modal.discard();
    }

    @action.bound shareAction(contacts) {
        routes.modal.discard(contacts);
    }

    // TODO: Wiring
    @action.bound unshareAction() {

    }

    @action.bound togglePage() {
        Keyboard.dismiss();
        LayoutAnimation.easeInEaseOut();
        if (this.currentPage === 0) {
            this.currentPage = 1;
        } else if (this.currentPage === 1) {
            this.currentPage = 0;
        }
    }

    get renderContactSelector() {
        const footer = fileState.currentFile && fileState.currentFile.isShared ? (
            <SharedFolderFooter
                title="title_viewSharedWith"
                action={this.togglePage}
                volume={fileState.currentFile}
                showAvatars
            />
        ) : null;
        return (
            <ContactSelectorUniversal
                onExit={this.exit}
                action={this.shareAction}
                title="title_shareWith"
                inputPlaceholder="title_searchByUsernameOrEmail"
                multiselect
                footer={footer}
            />);
    }

    get renderContactEdit() {
        if (this.currentPage !== 1) return null;
        return (<ContactEditPermission
            onExit={this.exit}
            action={this.unshareAction}
            title="title_sharedWith"
            footer={<SharedFolderFooter
                title="button_shareWithOthers"
                action={this.togglePage}
                icon="person-add"
            />}
        />);
    }

    render() {
        const page = this.currentPage === 0 ?
            this.renderContactSelector : this.renderContactEdit;
        // we need this container to keep non-transparent background
        // between LayoutAnimation transitions
        const container = {
            flexGrow: 1, backgroundColor: vars.darkBlueBackground05
        };
        return (
            <View style={container}>
                {page}
            </View>
        );
    }
}
