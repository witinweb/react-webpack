const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(__dirname, 'app/style/main.css')
};

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const common = {
    entry: {
        app: PATHS.app
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                // Test expects a RegExp! Note the slashes!
                test: /\.css$/,
                loaders: ['style', 'css'],
                // Include accepts either a path or an array of paths.
                include: PATHS.app
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015']
                },
                include: PATHS.app
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'React Webpack',
            appMountId: 'app',
            inject: false
        })
    ]
};

var config;

if(TARGET === 'start' || !TARGET){
    config = merge(
        common,
        {
            devtool: 'eval-source-map',
            devServer: {
                contentBase: PATHS.build,

                // Enable history API fallback so HTML5 History API based
                // routing works. This is a good default that will come
                // in handy in more complicated setups.
                historyApiFallback: true,
                hot: true,
                inline: true,

                // Display only errors to reduce the amount of output.
                stats: 'errors-only',

                // Parse host and port from env so this is easy to customize.
                //
                // If you use Vagrant or Cloud9, set
                // host: process.env.HOST || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices unlike default
                // localhost
                host: process.env.HOST,
                port: process.env.PORT
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
            ]
        });
}
if(TARGET === 'build'){
    config = merge(
        common,
        {
            devtool: 'source-map'
        }
    );
}
module.exports = validate(config);