const path = require('path');
const webpackConfig = require('./webpack.config');

webpackConfig.mode = 'production';
webpackConfig.output.library = 't-tap';
webpackConfig.output.libraryTarget = 'umd';

module.exports = webpackConfig;
