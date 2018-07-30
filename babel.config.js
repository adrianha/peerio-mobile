module.exports = function(api) {
    api.cache(false);
    return {
        compact: false,
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            [
                '@babel/plugin-proposal-object-rest-spread',
                { useBuiltIns: true }
            ],
            ['babel-plugin-root-import', { rootPathSuffix: 'build' }],
            '@babel/plugin-transform-modules-commonjs',
            [
                '@babel/transform-async-to-generator',
                {
                    module: 'bluebird',
                    method: 'coroutine'
                }
            ]
        ],
        env: {
            production: {
                sourceMaps: false,
                comments: false,
                plugins: ['console-kungfu']
            },
            development: {
                sourceMaps: true,
                presets: [['@babel/preset-react', { development: true }]]
            }
        }
    };
};
