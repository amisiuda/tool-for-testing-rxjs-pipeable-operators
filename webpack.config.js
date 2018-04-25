const path = require('path');


module.exports = {
    entry: './src/index.ts',
    target: 'node',
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    externals : {
        react: 'jasmine'
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    }
};
