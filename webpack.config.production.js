const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sourcePath = path.join(__dirname, './app');
const buildDirectory = path.join(__dirname, './dist');

const config = {
    devtool: 'source-map',
    entry: {
        app: './app/index',
    },
    resolve: {
        extensions: ['.json','.js', '.jsx'],
        modules: ['node_modules', sourcePath],
    },
    output: {
        path: buildDirectory,
        filename: 'bundle.js',
        publicPath: '/',
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
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
                test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=100000&name=img/[name].[ext]',
            },
            {
                test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=img/[name].[ext]',
            },
            {
                test: /\.bpmn$/,
                loader: 'file-loader?name=diagrams/[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
    },

};


module.exports = config;