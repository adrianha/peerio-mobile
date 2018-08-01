import { Platform, AdSupportIOS } from 'react-native';
import { when } from 'mobx';
import { socket } from '../lib/icebear';

function enableIdfa() {
    if (Platform.OS === 'ios') {
        AdSupportIOS.getAdvertisingId(idfa => {
            console.log(`App.js: tracking ${idfa}`);
            when(() => socket.connected,
                () => socket.send('/noauth/trackMobileInstall', { os: 'ios', idfa })
                    .then(() => console.log(`idfa.js: server responded ok`))
                    .catch(e => console.error(e)));
        }, e => {
            console.log(`App.js: error retrieving idfa, ${e}`);
        });
    }
}

module.exports = { enableIdfa };
