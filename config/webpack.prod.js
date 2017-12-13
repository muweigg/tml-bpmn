const helpers = require('./helpers');
const config = require('./webpack.common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SuppressExtractedTextChunksWebpackPlugin = require('./plugins/SuppressExtractedTextChunksWebpackPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = "production";
const COMMON_STYLE = helpers.root('src/styles/common.scss');

module.exports = webpackMerge(config({ env: ENV }), {
    output: {
        // filename: '[name].[chunkhash].bundle.js',
        // chunkFilename: '[id].[chunkhash].chunk.js',
        filename: '[name].js',
        chunkFilename: '[id].js',
    },
    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '.',
                    use: ['css-loader?importLoaders=1&minimize=true', 'postcss-loader', 'sass-loader']
                })
            },
        ]
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CleanPlugin(['dist'], { root: helpers.root() }),
        // new ExtractTextPlugin('[name].[contenthash].css'),
        new ExtractTextPlugin('[name].css'),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new UglifyJsPlugin({
            test: /.js($|\?)/i,
            exclude: /index/,
            sourceMap: false,
            parallel: true,
            uglifyOptions: {
                compress: { warnings: false, drop_console: true },
                output: { comments: false },
                ie8: true,
            },
        }),
    ]
});