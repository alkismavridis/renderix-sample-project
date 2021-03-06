const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/main/ts/ui/index.ts',
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
    ]
};
