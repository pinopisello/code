const path = require('path');
const merge = require('webpack-merge');  //Fa merging di webpack configuration ojects https://github.com/survivejs/webpack-merge
const validate = require('webpack-validator');//Valida il webpack config object finale https://github.com/js-dxtools/webpack-validator
const parts = require('./libs/parts');
const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING;


const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build'),
  test: path.join(__dirname, 'tests')
};



process.env.BABEL_ENV = TARGET;

const common = merge(
  {
    entry: {
      app: PATHS.app   //primo bundle app.js che contiene tutto cio che e' in folder /app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']//https://webpack.github.io/docs/configuration.html#resolve-extensions
    }
  },
  parts.indexTemplate({//
    title: 'React in action ch5',
    appMountId: 'app'     //<div id='app'> e' l elemento che ReactDOM.render() verra' chiamato per appiccicare la gerarchia React
  }),
  parts.loadJSX(PATHS.app)//definisce loader bable per tutti i files js e jsx
  //,parts.lintJSX(PATHS.app)//definisce preLoader eslint per tutti i files js e jsx
);

var config;

// Detect how npm is run and branch based on that
switch(TARGET) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        entry: { //definisce bundle 'style' per main.css 
          style: PATHS.style
        },
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({//definisce bundle 'vendor'
        name: 'vendor',
        entries: ['react', 'react-dom']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style)
    );
    break;
  case 'test':
  case 'test:tdd':
    config = merge(
      common,
      {
        devtool: 'inline-sourcp'
      },
      parts.loadIsparta(PATHS.app),
      parts.loadJSX(PATHS.test)
    );
    break;
  default://vale per start
    config = merge(
      common,
      {
        devtool: 'source-map',
        entry: {
          style: PATHS.style
        }
      },
      parts.setFreeVariable(
        'process.env.ENDPOINT',
        'http://localhost:3500'
      ),
      parts.setupCSS(PATHS.style),
      parts.devServer({
        // Customize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
        poll: ENABLE_POLLING
      }),
      parts.enableReactPerformanceTools(),
      parts.npmInstall()
    );
}

module.exports = validate(config, {
  quiet: false
});
