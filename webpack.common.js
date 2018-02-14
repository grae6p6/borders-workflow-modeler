const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sourcePath = path.join(__dirname, './app');
const buildDirectory = path.join(__dirname, './dist');
const SriPlugin = require('webpack-subresource-integrity');

module.exports = {
    resolve: {
        extensions: ['.json','.js', '.jsx'],
        modules: [path.resolve(__dirname),'node_modules', sourcePath],
    },
    output: {
        path: buildDirectory,
        filename: 'bundle.js',
        publicPath: '/',
        crossOriginLoading: 'anonymous',
    },
    plugins: [
        new SriPlugin({
            hashFuncNames: ['sha384'],
            enabled: process.env.NODE_ENV === 'production',
        }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: path.join(__dirname, 'app'),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
            },
            {
                test: /\.bpmn$/,
                loader: 'file-loader?name=diagrams/[name].[ext]'
            },
            {
                test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?name=img/[name].[ext]',
            },
            {
                test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]',
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?mimetype=image/svg+xml&name=img/[name].[ext]',
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]

            }

        ],

    }
};
