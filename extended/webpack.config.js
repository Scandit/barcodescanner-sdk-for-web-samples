module.exports = {
  // Set the entry file to the app
  entry: "./src/index.js",

  // Set the output for our built files, this will be referenced in the index.html
  output: {
    path: __dirname + "/dist",
    filename: "scripts.js"
  },

  // Set the configuration for the local server used only for development
  devServer: {
    // The public path and output.filename together should result in the file reference in index.html
    // As our index.html is outside of the src/dist folder, and our built script is referenced via dist/scripts.js,
    // we need to set devServer.publicPath in order for live reload to work during development.
    publicPath: "/dist",
    inline: true,
    open: true,
  }
};
