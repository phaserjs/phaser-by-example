const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    bundle: path.join(__dirname, "src/init.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "assets/html/index.html",
      filename: "index.html"
    }),
    new CleanWebpackPlugin({options: "dist/*.*"}),
    new CopyWebpackPlugin({ patterns: [{ from: './assets', to: './assets' }, { from: './assets/html/', to: './' }] }),
  ],
  stats: {
    colors: true
  }
};
