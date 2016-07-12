const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');

const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts.js');

const pkg = require('./package.json');

const PATHS = {
  app: path.join(__dirname, 'frontend'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'frontend', 'main.css')
  ],
  build: path.join(__dirname, 'static', 'bundles')
}

var common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].[hash].js',
    chunkFilename: '[hash].js'
  },
  plugins: [
    new BundleTracker({filename: './webpack-stats.json'})
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        },
        include: PATHS.app,
        exclude: /node_modules/
      }
    ]
  }
};

common = merge(common,
  parts.extractBundle({
    name: 'vendor',
    entries: Object.keys(pkg.dependencies)
  })
);

var config;

switch(process.env.npm_lifecycle_event) {
//  case 'dev-build':
  case 'build':
  case 'stats':
    config = merge(common,
      {
        devtool: 'source-map'
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app]),
      parts.clean(PATHS.build)
    );
    break;
  default:
    config = merge(common,
      {
        devtool: 'eval-source-map'
      },
      parts.setupCSS(PATHS.style)
    );
}

module.exports = validate(config);
