'use strict';

import stubApi from './api';
import ContentfulBlogImporter from '../../src/contentful-blog-importer';

export function prepareApiStub () {
  let result = {};

  beforeEach(() => {
    result.app = stubApi();
    result.importer = new ContentfulBlogImporter(
      'space-id', 'cma-token', { host: 'localhost:3000', secure: false }
    );
  });

  afterEach(() => {
    result.app.close();
  });

  return result;
}
