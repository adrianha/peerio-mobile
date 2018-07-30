import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import randomWords from 'random-words';
import SqlCipherDbStorage from '../../store/sqlcipher-db-storage';
import Text from '../controls/custom-text';
import mockLog from './mock-log';

function increment(oldValue, newValue) {
    if (newValue.counter <= oldValue.counter) {
        return null;
    }
    newValue.counter = oldValue.counter + 1;
    return newValue;
}

@observer
export default class MockSqlTest extends Component {
    db = null;

    componentDidMount() {
        this.db = new SqlCipherDbStorage('test');
        this.startTest();
    }

    async startTest() {
        mockLog.start('...');
        const { db } = this;
        mockLog.start('open db');
        await db.open();
        const k = randomWords();
        const v = randomWords();
        mockLog.log(`set k ${k} value to ${v}`);
        await db.setValue(k, v, () => true);
        const r = await db.getValue(k);
        mockLog.log(`result ${r}, ${v === r}`);
        mockLog.stopAndLog();
    }

    async startTest2() {
        mockLog.start('...');
        const { db } = this;
        mockLog.start('open db');
        await db.open();
        for (let i = 0; i < 100; ++i) {
            setTimeout(() => db.setValue('test', {}, increment));
        }
        const r = await db.getValue('test');
        mockLog.log(`result ${r}`);
        mockLog.stopAndLog();
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={{ justifyContent: 'flex-start', flexGrow: 1, padding: 20 }}>
                    <Text>Sql Db Storage test results:</Text>
                    <Text>{mockLog.list}</Text>
                </View>
            </View>
        );
    }
}
