const helpers = require('./helpers');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devServer = require('./devServer');
const htmlLoaderConfig = require('./htmlLoaderConfig');
const INDEX_HTML = helpers.root('src/index.html');
const entryPoints = ["index.css", "tml-bpmn.css", "tml-bpmn.js", "index.js"];

module.exports = function(options) {

    const isProd = options.env === 'production';

    return {

        devServer: devServer,

        entry: {
            'js/index': [helpers.root('src/js/index.ts')],
            'css/index': [helpers.root('src/css/index.scss')],
            'js/tml-bpmn': [helpers.root('src/js/tml-bpmn.ts')],
            'css/tml-bpmn': [helpers.root('src/css/tml-bpmn.scss')],
        },

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[file].map',
        },

        resolve: {
            extensions: ['.ts', '.js'],
            alias: rxPaths()
        },

        module: {
            rules: [
                { test: /\.ts$/, use: [ 'ts-loader' ], include: [helpers.root('src')] },
                { test: /\.json$/, use: ['json-loader'] },
                // { test: /\.css$/,  use: ['raw-loader', 'postcss-loader', 'sass-loader'] },
                // { test: /\.scss$/, use: ['raw-loader', 'postcss-loader', 'sass-loader'] },
                {
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: htmlLoaderConfig
                    }]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: '[path][name].[hash].[ext]',
                            outputPath: url => {
                                if (/^src/.test(url)) return url.replace(/^src/, '.');
                                if (/^node_modules/.test(url)) return url.replace(/^node_modules.*?assets/, './assets');
                            }
                        }
                    }]
                },
                {
                    test: /\.(eot|woff2?|ttf)([\?]?.*)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash].[ext]',
                            outputPath: url => {
                                if (/^src/.test(url)) return url.replace(/^src/, '.');
                                if (/^node_modules/.test(url)) return url.replace(/^node_modules.*?assets/, './assets');
                            }
                        }
                    }]
                },
            ]
        },

        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            /* new webpack.DefinePlugin({
                'PROD_ENV': JSON.stringify(isProd)
            }), */
            /* new CopyPlugin([{
                from: helpers.root('src/assets'),
                to: 'assets/[path][name].[hash].[ext]',
                ignore: ['favicon.ico']
            }]), */
            /* new webpack.optimize.CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills'],
            }), */
            /* new webpack.optimize.CommonsChunkPlugin({
                name: 'tml-bpmnjs',
                chunks: ['tml-bpmnjs'],
                minChunks: module => /node_modules/.test(module.resource)
            }), */
            /* new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity
            }), */
            new HtmlPlugin({
                filename: 'index.html',
                template: helpers.root('src/index.html'),
                // favicon: helpers.root('src/assets/favicon.ico'),
                chunksSortMode: function sort(left, right) {
                    let leftIndex = entryPoints.indexOf(left.names[0]);
                    let rightindex = entryPoints.indexOf(right.names[0]);
                    if (leftIndex > rightindex) {
                        return 1;
                    } else if (leftIndex < rightindex) {
                        return -1;
                    } else {
                        return 0;
                    }
                },
                inject: 'head'
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            /**
             * If you are interested to drill down to exact dependencies, try analyzing your bundle without ModuleConcatenationPlugin. See issue https://github.com/webpack-contrib/webpack-bundle-analyzer/issues/115 for more discussion.
             */
            // new BundleAnalyzerPlugin(),
        ]
    }
}