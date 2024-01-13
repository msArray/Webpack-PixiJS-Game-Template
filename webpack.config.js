// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackObfuscator = require('webpack-obfuscator');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;



const config = {
    entry: {
        index: {
            import: './src/index.ts',
        },
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, isProduction ? 'public' : 'dist'),
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
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),

        new MiniCssExtractPlugin(),

        isProduction ? new webpackObfuscator({rotateUnicodeArray: true}, []) : null,

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
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
