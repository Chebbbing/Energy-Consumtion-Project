const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "fs": false,
      "http": require.resolve("stream-http"),
      "zlib": require.resolve("browserify-zlib"),
      // Add other missing modules as needed
    },
  },
};