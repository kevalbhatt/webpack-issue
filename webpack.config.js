const path = require('path'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require("Html-webpack-plugin"),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

// Create multiple instances
const extractApp = new ExtractTextPlugin('styles/[name].css');
const extractVendor = new ExtractTextPlugin('styles/[name].css');


var ENV = process.env.NODE_ENV,
    buildType = process.env.BUILD_TYPE,
    isProd = (
        ENV === "production" ?
        true :
        false),
    BUILD_DIR = path.resolve(
        __dirname, 'dist'),
    ROOT_DIR = path.resolve(__dirname),
    APP_DIR = path.resolve(__dirname, 'src'),
    NODE_MODULES = path.resolve(__dirname, 'node_modules'),
    pathsToClean = [BUILD_DIR],
    config = {
        entry: {
            "test": [APP_DIR + "/test.js", APP_DIR + "/vendor.js"],
            //"test-vendor": [APP_DIR + "/vendor.js"]
        },
        output: {
            path: (
                isProd ?
                BUILD_DIR :
                ROOT_DIR), //<- This path is use at build time
            filename: "[name].min.js", //<- This file is created under path which we specified in output.path
            chunkFilename: '[name].min.js',
            library: "Test",
            libraryTarget: 'umd'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /node_modules/, // you may add "vendor.js" here if you want to
                        name: "test-vendor",
                        chunks: "initial",
                        enforce: true
                    }
                }
            }
        },
        // optimization: {
        //     splitChunks: {
        //         cacheGroups: {
        //             vendor: {
        //                 test: /moment-timezone|jquery|select2/,
        //                 name: "test-vendor",
        //                 chunks: "initial",
        //                 enforce: true
        //             }
        //         }
        //     }
        // },
        plugins: [
            new CleanWebpackPlugin(pathsToClean, {
                root: ROOT_DIR,
                verbose: true
            }),
            extractApp,
            extractVendor,
            new HtmlWebpackPlugin({
                title: 'test',
                template: (APP_DIR) + '/index.ejs',
                chunks: ['test-vendor', 'test'],
                filename: (
                    isProd ?
                    BUILD_DIR :
                    ROOT_DIR) + '/index.html'
            }),
            new HtmlWebpackPlugin({
                title: 'test-external-vendor',
                template: (APP_DIR) + '/index-external-vendor.ejs',
                chunks: ['test'],
                filename: (
                    isProd ?
                    ROOT_DIR + "/example" :
                    ROOT_DIR) + '/index-external-vendor.html'
            }),
            new webpack.DefinePlugin({ 'isProd': isProd }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                moment: "moment-timezone",
                select2: 'select2'
            })
        ],
        resolve: {
            modules: [
                APP_DIR, NODE_MODULES
            ],
            extensions: [
                '.js',
                '.jsx',
                '.html',
                '.css',
                '.scss'
            ]
        },
        module: {
            rules: [{
                    test: /\.jsx($|\?)|\.js($|\?)/,
                    exclude: /node_modules/,
                    include: [
                        APP_DIR, ROOT_DIR
                    ],
                    use: [{
                        loader: "babel-loader",
                        query: {
                            presets: [
                                "env"
                            ],
                            plugins: ["transform-decorators-legacy", "transform-flow-strip-types", "transform-class-properties", "transform-object-rest-spread", "add-module-exports"]
                        }
                    }]
                }, {
                    test: /\.css$/,
                    use: extractVendor.extract({
                        use: [{
                            loader: "css-loader",
                            options: {
                                minimize: isProd,
                                includePaths: [
                                    NODE_MODULES
                                ]
                            }
                        }]
                    })

                },
                {
                    test: /\.scss$/,
                    use: extractApp.extract({
                        use: [{
                            loader: "css-loader",
                            options: {
                                minimize: isProd
                            }
                        }, {
                            loader: "sass-loader",
                            options: {
                                includePaths: [
                                    APP_DIR + "/styles"
                                ]
                            }
                        }]
                    })
                },
                {
                    test: require.resolve('select2'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'select2'
                    }]
                },
                {
                    test: require.resolve('moment'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'moment'
                    }]
                },
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    }, {
                        loader: 'expose-loader',
                        options: '$'
                    }]
                }
            ]
        },
        devServer: {
            port: 9099,
            host: "0.0.0.0",
            disableHostCheck: true
        }
    };

if (!isProd) {
    config['devtool'] = 'inline-source-map';
    config['cache'] = true;
}
module.exports = config;