'use strict';

import { prepareApiStub, fakeContentTypes } from '../support/helper';
import importData from '../../src/data';
import * as Author from '../../src/data/author';
// import * as Post from '../../src/data/post';
import * as Tag from '../../src/data/tag';
import * as sinon from 'sinon';

describe('data', () => {
  let env = prepareApiStub();
  let contentTypes = fakeContentTypes();
  let data = { authors: [], posts: [], tags: [] };

  describe('importData', () => {
    let space;

    beforeEach(() => {
      return env.importer.client.getSpace('space-id')
        .then((_space) => space = _space);
    });

    it.only('imports data', () => {
      sinon.mock(Author).expects('importData').withArgs([], space, contentTypes.Author, data);
      // sinon.mock(Post).expects('importData').withArgs([], space, contentTypes.Post, data);
      sinon.mock(Tag).expects('importData').withArgs([], space, contentTypes.Tag, data);

      return importData(space, contentTypes, data);
    });
  });
});
