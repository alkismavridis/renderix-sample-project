const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/main/ts/gui/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader:'ts-loader',
                    options: {configFile: "webpack/tsconfig.json"}
                }],
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
         modules: [path.resolve(__dirname, '../src/main/ts/'), 'node_modules'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../out'),
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "bundle.css", chunkFilename: "[id].css"}),
        new CopyPlugin({
            patterns: [{ from: './src/main/resources', to: './resources' }]
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, '../out'),
        compress: true,
        port: 9000,

        historyApiFallback: {
        rewrites: [
                { from: /./, to: '/resources/dev-master-template.html' }
            ]
        }
    }
};
