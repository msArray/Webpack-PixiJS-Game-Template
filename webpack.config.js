// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackObfuscator = require('webpack-obfuscator');
const workBoxWebpackPlugin = require("workbox-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;



const config = {
    entry: {
        index: './src/index.ts',
    },
    output: {
        filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
        path: path.resolve(__dirname, isProduction ? 'docs' : 'dist'),
    },
    optimization: {
        splitChunks: {
            // cacheGroups内にバンドルの設定を複数記述できる
            cacheGroups: {
                // 今回はvendorだが、任意の名前で問題ない
                vendor: {
                    // node_modules配下のモジュールをバンドル対象とする
                    test: /node_modules/,
                    name: 'vendor',
                    chunks: 'initial',
                    enforce: true
                }
            }
        }
    },
    devServer: {
        open: true,
    },
    plugins:
        isProduction ?
            [
                new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, 'src/html', 'web.html'),
                }),

                new MiniCssExtractPlugin(),

                new WebpackPwaManifest({
                    short_name: "My Game",
                    name: "My Game",
                    display: "standalone",
                    start_url: "index.html",
                    background_color: "#000000",
                    theme_color: "#FFFFFF",
                    /*
                    icons: [{
                        src: path.resolve(__dirname, "src/images/icon_512.png"),
                        sizes: [96, 128, 192, 256, 384, 512],
                    }]*/
                }),

                new workBoxWebpackPlugin.GenerateSW({
                    swDest: path.resolve(__dirname, "docs") + "/service-worker.js"
                })

                // 難読化ツール　入れると小数点以下の計算がバグるので使わない方が良い
                /*new webpackObfuscator({
                    stringArrayCallsTransform: true,
                    stringArrayEncoding: [
                        'base64'
                    ],
                    stringArrayThreshold: 1,
                }, [])*/

                // Add your plugins here
                // Learn more about plugins from https://webpack.js.org/configuration/plugins/
            ] : [
                new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, 'src/html', 'web.html'),
                }),

                new MiniCssExtractPlugin(),
            ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }
    return config;
};
