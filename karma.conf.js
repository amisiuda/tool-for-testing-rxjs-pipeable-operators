module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: [ 'jasmine' ],
        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-babel-preprocessor'),
            require('karma-spec-reporter'),
        ],
        files: [ 'spec/main.spec.ts' ],
        preprocessors: {
            'spec/main.spec.ts': [ 'webpack', 'sourcemap' ],
        },
        mime: {
            'text/x-typescript':  [ 'ts', 'tsx' ]  // `tsx` is optional depending on your environment
        },
        webpack: require('./webpack.config.js'),
        reporters: [ 'spec' ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [ 'ChromeDebugging' ],
        singleRun: false,
        concurrency: Infinity,
        files: [
            'src/**/expected-operators-builder.spec.ts',
            'src/**/expected-operators.spec.ts',
            'src/**/piped-operators.spec.ts',
            'src/**/expected-operators-validator.spec.ts',

            'src/**/operators/*.integration.spec.ts',
            'src/**/index.integration.spec.ts',
            
            // 'src/**/*.spec.ts',
        ],
        preprocessors: {
            'src/**/expected-operators-builder.spec.ts': [ 'webpack' ],
            'src/**/expected-operators.spec.ts': [ 'webpack' ],
            'src/**/piped-operators.spec.ts': [ 'webpack' ],
            'src/**/expected-operators-validator.spec.ts': [ 'webpack' ],

            'src/**/operators/*.integration.spec.ts': [ 'webpack' ],
            'src/**/index.integration.spec.ts': [ 'webpack' ],

            // 'src/**/*.spec.ts': [ 'webpack' ],
        },
        customLaunchers: {
            ChromeDebugging: {
                base: 'Chrome',
                flags: [ '--remote-debugging-port=9333' ]
            }
        },
    })
}