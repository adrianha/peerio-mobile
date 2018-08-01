const { iOSBuildPath, androidBuildPath } = require('./buildPaths');

const iOS = {
    port: 4723,
    desiredCapabilities: {
        waitForQuiescence: false,
        platformName: 'iOS',
        platformVersion: process.env.PEERIO_IOS_VERSION,
        deviceName: process.env.PEERIO_IOS_SIM,
        app: iOSBuildPath
    }
};

const android = {
    port: 4723,
    desiredCapabilities: {
        platformName: 'Android',
        platformVersion: process.env.PEERIO_ANDROID_VERSION,
        deviceName: process.env.PEERIO_ANDROID_DEVICE,
        app: androidBuildPath,
        autoGrantPermissions: true
    }
};

module.exports = { iOS, android };
