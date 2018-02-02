const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sourcePath = path.join(__dirname, './app');
const buildDirectory = path.join(__dirname, './dist');


const config = {
    devtool: 'eval',
    entry: {
        app: [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8001',
            'webpack/hot/only-dev-server',
            './app/index'
        ],
    },
    resolve: {
        extensions: ['.json','.js', '.jsx'],
        modules: [path.resolve(__dirname),'node_modules', sourcePath],
    },
    output: {
        path: buildDirectory,
        filename: 'bundle.js',
        publicPath: '/',
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.HotModuleReplacementPlugin(),
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
            }
        ],

    }
};

module.exports = config;