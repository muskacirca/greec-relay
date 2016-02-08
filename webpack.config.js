module.exports = {
  entry: "./src/frontend/App.js",
  output: {
    filename: "src/public/bundle.js"
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
