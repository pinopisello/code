const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');//A webpack plugin to remove/clean your build folder(s) before building  https://github.com/johnagan/clean-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin');//https://github.com/webpack/extract-text-webpack-plugin It moves every require("style.css") in entry chunks into a separate css output file. 
                                                                 //So your styles are no longer inlined into the javascript, but separate in a css bundle file (styles.css). 
const HtmlWebpackPlugin = require('html-webpack-plugin');//https://github.com/ampedandwired/html-webpack-plugin
														 //Genera dist/index.html che serve il bundle/s generati da webpack
const NpmInstallPlugin = require('npm-install-webpack-plugin');//https://github.com/ericclemmons/npm-install-webpack-plugin
                                                               //Speed up development by automatically installing & saving dependencies with Webpack.//


exports.indexTemplate = function(options) {  //Genera build/index.html con title "options.title" e una div  <div id="app"></div> 
  return {                                   //con tutti gli script links ai bundles:
	  										 /*
											    <script src="manifest.583a120a12d2fa431eb6.js" type="text/javascript"></script>
											    <script src="vendor.051ed1566688fc29532a.js" type="text/javascript"></script>											    
											    <script src="style.6b8bdac046a574e46cf7.js" type="text/javascript"></script>											    
											    <script src="app.86313bf6ca490a39a9d0.js" type="text/javascript"></script>
											  */
    plugins: [
      new HtmlWebpackPlugin({
        template: require('html-webpack-template'),//https://github.com/jaketrent/html-webpack-template
        										   //Configura HtmlWebpackPlugin 
        										   // template: 'node_modules/html-webpack-template/index.ejs',
        title: options.title,
        appMountId: options.appMountId,            // The <div> element id on which you plan to mount a JavaScript app.
        inject: false							   //Set to false. Controls asset addition to the template. This template takes care of that.
      })
    ]
  };
}

exports.loadJSX = function(include) {
  return {
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          // Enable caching for extra performance
          loaders: ['babel?cacheDirectory'],//Richiede babel-loader in package.json https://github.com/babel/babel-loader
          include: include					//babel-loader dipende da babel-core ...
        }
      ]
    }
  };
}

exports.loadIsparta = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['isparta-instrumenter'],
          include: include
        }
      ]
    }
  };
}

exports.lintJSX = function(include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['eslint'],
          include: include
        }
      ]
    }
  };
}

exports.enableReactPerformanceTools = function() {
  return {
    module: {
      loaders: [
        {
          test: require.resolve('react'),
          loader: 'expose?React'
        }
      ]
    }
  };
}

exports.devServer = function(options) {
  const ret = {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };

  if(options.poll) {
    ret.watchOptions = {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000
    };
  }

  return ret;
}

exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],  //richiede     "style-loader" e     "css-loader" in package.json
          include: paths
        }
      ]
    }
  };
}

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
}

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

exports.extractBundle = function(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    // Define an entry point needed for splitting.
    entry: entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],

        // options.name modules only
        minChunks: Infinity
      })
    ]
  };
}

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  };
}

exports.extractCSS = function(paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}

exports.npmInstall = function(options) {
  options = options || {};

  return {
    plugins: [
      new NpmInstallPlugin(options)
    ]
  };
}
