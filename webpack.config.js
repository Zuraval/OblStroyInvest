const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fs = require('fs');
const pagesDir = path.resolve(__dirname, 'src/pages');
const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.pug'));

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash].js' : 'js/bundle.js',
      clean: true,
    },
    devServer: {
      static: './dist',
      open: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          },
        },
        {
          test: /\.pug$/,
          use: ['@webdiscus/pug-loader'],
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      ...pageFiles.map(file => {
        const name = file.replace(/\.pug$/, '');
        return new HtmlWebpackPlugin({
          filename: `${name}.html`,
          template: `src/pages/${file}`,
          inject: true,
        });
      }),

      ...(isProd ? [new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' })] : []),
    ],
  };
};