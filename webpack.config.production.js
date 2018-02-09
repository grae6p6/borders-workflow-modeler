const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');


module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',
    entry: {
        app: './app/index',
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new CopyWebpackPlugin([
            {from:'./public/img', to:'img'},
            {from:'server.js', to:''}
        ]),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: { ecma: 8 }
        })
    ],

});
