'use strict';

import stubApi from './api';
import ContentfulBlogImporter from '../../src/contentful-blog-importer';
import * as AuthorSchema from '../../src/schema/author';
import * as PostSchema from '../../src/schema/post';
import * as TagSchema from '../../src/schema/tag';

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

export function fakeContentTypes () {
  return {
    Author: AuthorSchema.schema(),
    Post: PostSchema.schema(),
    Tag: TagSchema.schema()
  };
}
