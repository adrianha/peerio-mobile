import React, { Component } from 'react';
import {
    View, Text, TextInput, ActivityIndicator, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react/native';
import { when } from 'mobx';
import { t } from 'peerio-translator';
import Layout1 from '../layout/layout1';
import Center from '../controls/center';
import Avatar from '../shared/avatar';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import contactState from './contact-state';
import { contactStore } from '../../lib/icebear';

const actions = {
    send: () => contactState.send(),
    share: () => contactState.share()
};

@observer
export default class ContactSelector extends Component {
    constructor(props) {
        super(props);
        this.exit = this.exit.bind(this);
    }

    exit() {
        contactState.exit();
    }

    removeRecipient(c) {
        contactState.remove(c);
    }

    userbox(contact, i) {
        const style = {
            backgroundColor: vars.bg,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            margin: 4,
            padding: 0,
            paddingLeft: 12,
            height: 32,
            overflow: 'hidden'
        };
        const textStyle = {
            color: 'white'
        };

        return (
            <TouchableOpacity key={i} onPress={() => this.removeRecipient(contact)} >
                <View style={style}>
                    <Text style={textStyle}>{contact.username}</Text>
                    <Icon
                        style={{ paddingRight: 4, marginLeft: 8 }}
                        name="cancel"
                        size={vars.iconSize}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
        );
    }


    userboxline() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingLeft: 8,
            flexWrap: 'wrap'
        };
        const boxes = contactState.recipients.map((c, i) => this.userbox(c, i));

        return (
            <View style={container}>
                {boxes}
            </View>
        );
    }

    onChangeFindUserText(text) {
        contactState.findUserText = text;
        if (text && text.length > 0) {
            this.searchUser(text);
        }
    }

    textbox() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1,
            marginLeft: 8
        };

        return (
            <View style={container}>
                {icons.dark('search')}
                <TextInput
                    value={contactState.findUserText}
                    onChangeText={text => this.onChangeFindUserText(text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Find someone by username"
                    ref={ti => (this.textInput = ti)} style={style} />
            </View>
        );
    }

    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            paddingTop: 0,
            paddingBottom: 0
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: 14,
            fontWeight: vars.font.weight.semiBold,
            color: 'rgba(0, 0, 0, .54)'
        };
        const goStyle = {
            fontSize: 14,
            fontWeight: vars.font.weight.semiBold,
            color: vars.bg
        };
        return (
            <View style={container}>
                {icons.dark('close', this.exit)}
                <Center style={style}><Text style={textStyle}>{this.props.title}</Text></Center>
                {contactState.recipients.length ?
                    icons.text(t('go'), () => this.action(), goStyle) : icons.placeholder()}
            </View>
        );
    }

    action() {
        actions[this.props.action]();
    }

    item(contact, i) {
        const { username } = contact;
        return (
            <Avatar
                contact={contact}
                checkbox
                checkedKey={username}
                checkedState={contactState.recipientsMap}
                key={username || i}
                message={username}
                hideOnline
                onPress={() => contactState.toggle(contact)} />
        );
    }

    searchUser(username) {
        console.log(`compose-message.js: searching for ${username}`);
        const c = contactStore.getContact(username);
        contactState.loading = true;
        when(() => !c.loading, () => {
            console.log(`compose-message.js: search done for ${username}, not found: ${c.notFound}`);
            contactState.loading = false;
            if (!c.notFound) {
                console.log(`compose-message.js: adding contact`);
                console.log(c);
                contactState.found = [c];
            } else {
                contactState.found = [];
            }
        });
    }

    body() {
        const found = contactState.filtered;
        const mockItems = found.map((item, i) => this.item(item, i));
        const activityIndicator = <ActivityIndicator style={{ marginTop: 10 }} />;
        // const result = findUserText && findUserText.length ? mockItems : chat;
        const result = mockItems;
        const body = !found.length && contactState.loading ? activityIndicator : result;
        return (
            <View>
                {body}
            </View>
        );
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    header() {
        const tbSearch = this.textbox();
        const userRow = this.userboxline();
        const exitRow = this.exitRow();
        const recipients = contactState.recipients;
        return (
            <View>
                {this.lineBlock(exitRow)}
                {/* TODO combine recipients and search */}
                {recipients.length ? this.lineBlock(userRow) : null}
                {this.lineBlock(tbSearch)}
            </View>
        );
    }

    render() {
        const header = this.header();
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={body}
                header={header}
                style={layoutStyle} />
        );
    }
}

ContactSelector.propTypes = {
    title: React.PropTypes.string,
    action: React.PropTypes.string
};
