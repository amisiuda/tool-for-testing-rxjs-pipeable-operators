const path = require('path');
const webpackConfig = require('./webpack.config');

webpackConfig.mode = 'developemnt';
webpackConfig.devtool = 'inline-source-map';

module.exports = webpackConfig;
