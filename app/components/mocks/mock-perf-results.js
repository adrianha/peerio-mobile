import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import randomWords from 'random-words';
import sqlcipher from 'react-native-sqlcipher-storage';
import SqlCipherDbStorage from '../../store/sqlcipher-db-storage';
// import sqlite from 'react-native-sqlite-storage';
import Text from '../controls/custom-text';
import KeyValueStorage from '../../store/key-value-storage';

let beacon = null;
let lastTitle = '';

const state = observable({
    log: ''
});

function start(title) {
    stopAndLog();
    log(`Starting ${title}`);
    lastTitle = title;
    beacon = new Date();
}

function stopAndLog() {
    if (!beacon) return;
    const ms = new Date() - beacon;
    log(`${lastTitle} passed: ${ms} ms`);
    beacon = null;
    lastTitle = '';
}

function log(line) {
    state.log += `${line}\n`;
}

const RECORD_TEST_COUNT = 5000;

let sql = null;

function sqlWrite(i) {
    return sql.executeSql(
        'INSERT OR REPLACE INTO key_value(key, value) VALUES(?, ?)', [i, randomWords()]
    );
}

function sqlRead(i) {
    return sql.executeSql(
        'SELECT value FROM key_value WHERE key=?', [i]
    );
}

async function sqlReadBatch() {
    const dataset = await sql.executeSql(
        'SELECT * FROM key_value'
    );
    log(dataset[0].rows.length);
}

let keyValueStorage = null;

function tinyDbWrite(i) {
    return keyValueStorage.setValue(i, randomWords());
}

function tinyDbRead(i) {
    return keyValueStorage.getValue(i);
}

@observer
export default class MockActionSheet extends Component {
    @observable log = '';

    componentDidMount() {
        keyValueStorage = new KeyValueStorage('test');
        this.startTest();
    }

    async sqlCipherPrepare() {
        const name = 'test-perf-encrypted';
        // const key = 'supertestkey';
        sql = await sqlcipher.openDatabase({ name, location: 2 /* , key */ });
        try {
            await sql.executeSql('DROP TABLE key_value');
        } catch (e) {
            console.log(e);
        }
        try {
            await sql.executeSql(
                'CREATE TABLE key_value(key TEXT PRIMARY KEY, value TEXT) WITHOUT ROWID'
            );
        } catch (e) {
            console.log(e);
        }
    }

    async batch(operator) {
        let r = Promise.resolve();
        let counter = 0;
        const inserter = () => operator(counter++);
        for (let i = 0; i < RECORD_TEST_COUNT; ++i) {
            r = r.then(inserter);
        }
        await r;
    }

    async sqlCipherStorageTest() {
        start('Open storage');
        const storage = new SqlCipherDbStorage('fixed-user');
        await storage.open();
        const k = randomWords();
        const v = randomWords();
        start(`Writing single string value ${k}, ${v}`);
        await storage.setValue(k, v);
        const stored = await storage.getValue(k);
        if (stored === v) {
            log('...passed');
        }
        start(`Deleting key ${k}`);
        await storage.removeValue(k);
        if (!await storage.getValue(k)) {
            log('...passed');
        }
        start(`Clearing storage`);
        await storage.clear();
        start(`Adding test keys`);
        for (let i = 0; i < 10; ++i) {
            await storage.setValue(i, randomWords());
        }
        start(`Retrieving test keys`);
        const keys = await storage.getAllKeys();
        keys.forEach(testKey => log(testKey));
        start(`Retrieving test values`);
        const values = await storage.getAllValues();
        values.forEach(testValue => log(testValue));
    }

    async tinyDbAndRawSqlTest() {
        start(`TinyDB write test: ${RECORD_TEST_COUNT} rows`);
        await this.batch(tinyDbWrite);
        start(`TinyDB read test: ${RECORD_TEST_COUNT} rows`);
        await this.batch(tinyDbRead);
        start('SQL Cipher prepare');
        await this.sqlCipherPrepare();
        start(`SQLCipher write test: ${RECORD_TEST_COUNT} rows:`);
        await this.batch(sqlWrite);
        start(`SQLCipher read test: ${RECORD_TEST_COUNT} rows:`);
        await this.batch(sqlRead);
        start(`SQLCipher read batch test: ${RECORD_TEST_COUNT} rows:`);
        await sqlReadBatch();
    }

    async startTest() {
        start('...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.sqlCipherStorageTest();
        stopAndLog();
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={{ justifyContent: 'flex-start', flexGrow: 1, padding: 20 }}>
                    <Text>Performance test results:</Text>
                    <Text>{state.log}</Text>
                </View>
            </View>
        );
    }
}
