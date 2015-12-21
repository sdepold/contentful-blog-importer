'use strict';

try {
  module.exports = require('./src/contentful-blog-importer');
} catch (e) {
  require('babel-register')({
    only: /contentful-blog-importer\/src/,
    presets: ['es2015']
  });

  module.exports = require('./src/contentful-blog-importer');
}
