import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { t, has } from 'peerio-translator';
import { reaction } from 'mobx';
import Text from '../controls/custom-text';
import uiState from '../layout/ui-state';
import whiteLabelConfig from '../whitelabel/white-label-config';

function findPrefixedName(k) {
    if (!k) return null;
    const prefix = whiteLabelConfig.LOCALE_PREFIX;
    let name = k;
    if (name.startsWith('title_seeWhoYouAlreadyKnow')) {
        console.log('here');
    }
    const mobileName = `${name}_mobile`;
    if (has(mobileName)) {
        name = mobileName;
    }
    if (prefix) {
        const whitelabelName = `${prefix}${name}`;
        if (has(whitelabelName)) name = whitelabelName;
    }
    return name;
}

// TODO: this doesn't need @observer, probably, never
class T extends Component {
    componentDidMount() {
        this.localeUpdateReaction = reaction(() => uiState.locale, () => {
            // console.log('update reaction');
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        // console.log('umount');
        this.localeUpdateReaction && this.localeUpdateReaction();
    }

    render() {
        const name = findPrefixedName(this.props.k);
        if (!name) return null;
        if (!has(name)) {
            console.error(`${name} not found`);
        }
        let translated = t(name, this.props.children);
        if (Array.isArray(translated)) {
            return (
                <Text>
                    {translated.map((o, i) => <Text key={i}>{o}</Text>)}
                </Text>
            );
        }
        if (this.props.uppercase) {
            translated = translated.toUpperCase();
        }
        return <Text>{translated}</Text>;
    }
}

T.propTypes = {
    children: PropTypes.any,
    k: PropTypes.string,
    uppercase: PropTypes.bool
};

module.exports = {
    T,
    t(k, params) {
        const r = t(findPrefixedName(k), params);
        if (r instanceof String || typeof r === 'string') return r;
        return React.createElement(T, { k }, params);
    },
    tu(k, params) {
        const r = t(findPrefixedName(k), params);
        if (r.toUpperCase) return r.toUpperCase();
        return React.createElement(T, { k, uppercase: true }, params);
    },
    tx: (k, params) => t(findPrefixedName(k), params)
};
