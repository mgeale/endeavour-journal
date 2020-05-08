const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: { app: './src/scripts/index.js' },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Capt. Cook Journal Onboard HMS Endeavour, 1768 to 1771',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ],
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader',
            ],
        }],
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    }
};