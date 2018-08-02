import { Platform } from 'react-native';
import { setUrlMap, setTagHandler } from 'peerio-translator';
import tagHandlers from '../components/controls/tag-handlers';
import rnFileStream from './rn-file-stream';
import KeyValueStorage from '../store/key-value-storage';
import SqlCipherDbStorage from '../store/sqlcipher-db-storage';
import whitelabel from '../components/whitelabel/white-label-config';
import helpers from '../telemetry/helpers';

const { setStringReplacement } = require('peerio-translator');

export default (c, icebear, tm) => {
    const cfg = c;
    cfg.ghostFrontendUrl = 'https://mail.peerio.com';
    // --- TRANSLATOR
    cfg.translator = {};
    if (whitelabel.stringReplacements) {
        cfg.translator.stringReplacements = whitelabel.stringReplacements; // white label only
        cfg.translator.stringReplacements.forEach((replacementObject) => {
            setStringReplacement(replacementObject.original, replacementObject.replacement);
        });
    }

    // Telemetry
    const { S } = tm;
    const tmSendEvent = (event) => helpers.send(tm, event);

    cfg.translator.urlMap = {
        fingerprint: {
            link: whitelabel.FINGERPRINT || 'https://peerio.zendesk.com/hc/en-us/articles/204394135'
        },
        mpDetail: {
            link: whitelabel.MP_DETAIL || 'https://peerio.zendesk.com/hc/en-us/articles/214633103-What-is-a-Peerio-Master-Password-',
            tracker: () => tmSendEvent([S.VIEW_LINK, { item: S.WHERE_ACCOUNT_KEY }])
        },
        tfaDetail: {
            link: whitelabel.TFA_DETAIL || 'https://peerio.zendesk.com/hc/en-us/articles/203665635-What-is-two-factor-authentication-'
        },
        msgSignature: {
            link: whitelabel.MSG_SIGNATURE || 'https://peerio.zendesk.com/hc/en-us/articles/204394135'
        },
        upgrade: {
            link: 'route:modal:accountUpgradeSwiper'
        },
        createRoom: {
            link: 'route:modal:createChannel'
        },
        signup: {
            link: 'route:app:signupStep1',
            tracker: () => tmSendEvent([S.START_ACCOUNT_CREATION, { text: S.SIGN_UP, sublocation: S.SIGN_IN }])
        },
        settings: {
            link: 'route:main:settings'
        },
        proWelcome: {
            link: whitelabel.PRO_WELCOME || 'https://peerio.zendesk.com/hc/en-us/articles/208395556'
        },
        proAccount: {
            link: whitelabel.PRO_ACCOUNT || 'https://account.peerio.com'
        },
        helpCenter: {
            link: whitelabel.HELP_CENTER || 'https://peerio.zendesk.com/'
        },
        contactSupport: {
            link: whitelabel.CONTACT_SUPPORT || 'https://peerio.zendesk.com/hc/en-us/requests/new'
        },
        socialShareUrl: {
            link: whitelabel.SOCIAL_SHARE_URL || 'https://www.peerio.com/'
        },
        googleAuth: {
            link: 'https://support.google.com/accounts/answer/1066447?hl=en'
        },
        iosApp: {
            link: whitelabel.IOS_APP || 'https://itunes.apple.com/app/peerio-2/id1245026608'
        },
        androidApp: {
            link: whitelabel.ANDROID_APP || 'https://play.google.com/store/apps/details?id=com.peerio.app'
        },
        googleAuthA: {
            link: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en'
        },
        googleAuthI: {
            link: 'https://itunes.apple.com/app/google-authenticator/id388497605'
        },
        authy: {
            link: 'https://authy.com'
        },
        download: {
            link: whitelabel.DOWNLOAD || 'https://peerio.com/download'
        },
        learnUrlTracking: {
            link: whitelabel.LEARN_URL_TRACKING || 'https://peerio.zendesk.com/hc/en-us/articles/115005090766'
        },
        identityVerification: {
            link: whitelabel.IDENTITY_VERIFICATION || 'https://peerio.zendesk.com/hc/en-us/articles/204480655-Verifying-a-Peerio-ID-'
        },
        jitsiLink: {
            link: 'https://jitsi.org/'
        },
        learnLegacyFiles: {
            link: 'https://www.peerio.com/blog/posts/new-filesystem/'
        },
        termsUrl: {
            link: whitelabel.TERMS_URL || 'https://peerio.com/conditions.html'
        },
        privacyUrl: {
            link: whitelabel.PRIVACY || 'https://peerio.com/privacy.html'
        }
        // sharedFiles: '' TODO: Add link to file
    };

    setUrlMap(cfg.translator.urlMap);
    for (const name in tagHandlers) {
        setTagHandler(name, tagHandlers[name]);
    }

    cfg.logRecipients = ['support@peerio.com'];

    cfg.download.parallelism = 2;
    cfg.download.maxDownloadChunkSize = 1024 * 1024;
    cfg.download.maxDecryptBufferSize = 1024 * 1024 * 2;
    cfg.upload.encryptBufferSize = 1024 * 1024;
    cfg.upload.uploadBufferSize = 1024 * 1024;

    cfg.isMobile = true;
    // socket server is always taken from env
    cfg.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://changeme.peerio.com';
    cfg.FileStream = rnFileStream(icebear.FileStreamAbstract);
    cfg.StorageEngine = KeyValueStorage;
    cfg.CacheEngine = SqlCipherDbStorage;

    cfg.FileStream.getCacheList()
        .then(r => {
            console.log(r);
        });

    cfg.appVersion = require('../../package.json').version;

    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        console.error(`mobile-config.js: unknown platform ${Platform.OS}`);
    }

    cfg.platform = Platform.OS;
    cfg.appLabel = process.env.APP_LABEL;
    cfg.whiteLabel = { name: process.env.APP_LABEL };
    cfg.appleTestUser = whitelabel.APPLE_REVIEW_ACCOUNT || 'applereview2607';
    cfg.appleTestPass = 'icebear';
    cfg.appleTestServer = 'wss://treetrunks.peerio.com';
    cfg.enableVolumes = process.env.SHARED_FOLDERS_ENABLED;
    cfg.preferredServerVersion = '7.0.0';
    Object.assign(cfg.chat, {
        maxInitialChats: 15,
        initialPageSize: 20, // amount of messages to load to a newly opened chat
        pageSize: 20, // when next/prev pages is requested, chat will load this amount of messages
        maxLoadedMessages: 60, // chat will remove excess of messages if paging resulted in larger count
        decryptQueueThrottle: 10, // ms, delay between processing messages in a batch
        inlineImageSizeLimitCutoff: 10 * 1024 * 1024,
        inlineImageSizeLimit: 3 * 1024 * 1024
    });
};
