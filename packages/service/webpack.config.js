const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    bundle: "./src/service.ts",
    mq: "./src/message-queue-worker.ts",
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
  devtool: "cheap-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".json",".mjs", ".ts", ".tsx", ".js", ".jsx", ".md"],
    plugins: [],
  },
  plugins: [new NodemonPlugin(), new DefinePlugin({ "global.GENTLY": false })],
  node: {
    __dirname: true,
  },
};
