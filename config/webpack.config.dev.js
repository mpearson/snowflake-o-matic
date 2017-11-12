var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
var InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
var WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
var getClientEnvironment = require("./env");
var paths = require("./paths");
var path = require('path');


// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = "/";
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = "";
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

module.exports = {
  devtool: "cheap-module-source-map",
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve("webpack-dev-server/client") + "?/",
    // require.resolve("webpack/hot/dev-server"),
    // require.resolve("react-dev-utils/webpackHotDevClient"),

    require.resolve("./polyfills"),
    paths.appIndexJs
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It"s just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: "static/app.js",
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath
  },
  resolve: {
    // root: [path.resolve(".")],
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    // fallback: paths.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx", ".less", ".css"]
  },

  module: {
    rules: [
      // {
      //   exclude: [
      //     /\.html$/,
      //     /\.(js|jsx)$/,
      //     /\.(ts|tsx)$/,
      //     /\.css$/,
      //     /\.json$/,
      //     /\.svg$/
      //   ],
      //   loader: "url",
      //   query: {
      //     limit: 10000,
      //     name: "static/media/[name].[hash:8].[ext]"
      //   }
      // },
      // Compile .tsx?
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        loader: ["ts-loader"],
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.

      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: ["json"]
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: ["ts-loader!svg-react"],
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            // options: {
            //   paths: [
            //     path.resolve(__dirname, "node_modules")
            //   ]
            // }
          }
        ]
      }
    ]
  },
  plugins: [
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === "development") { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn"t work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don"t have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  // Some libraries import Node modules but don"t use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};