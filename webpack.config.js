const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./front/app/entry.jsx",
  output: {
    path: path.join(__dirname, "/front/public"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015', `react`]
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};
