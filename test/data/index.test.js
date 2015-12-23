'use strict';

import { expect } from 'chai';
import { prepareApiStub, fakeContentTypes } from '../support/helper';
import importData from '../../src/data';
import * as Author from '../../src/data/author';
import * as Post from '../../src/data/post';
import * as Tag from '../../src/data/tag';
import * as sinon from 'sinon';

describe('data', () => {
  let env = prepareApiStub();
  let contentTypes = fakeContentTypes();

  describe('importData', () => {
    let space, data;

    beforeEach(() => {
      data = { authors: [], posts: [], tags: [] };
      return env.importer.client.getSpace('space-id')
        .then((_space) => space = _space);
    });

    it('imports data', () => {
      let authorMock = sinon.mock(Author);
      let postMock = sinon.mock(Post);
      let tagMock = sinon.mock(Tag);

      authorMock.expects('importData').withArgs([], space, contentTypes.Author, data);
      postMock.expects('importData').withArgs([], space, contentTypes.Post, data);
      tagMock.expects('importData').withArgs([], space, contentTypes.Tag, data);

      return importData(space, contentTypes, data).then(() => {
        authorMock.restore();
        postMock.restore();
        tagMock.restore();
      });
    });

    it('rejects malformed authors', () => {
      data.authors.push({ name: 'John Doe', slug: 'john-doe', foo: 'bar' });

      return importData(space, contentTypes, data).then(() => {
        expect('should not end up here').to.eql(null);
      }, (err) => {
        expect(err.message).to.eql('Invalid author properties found: foo');
      });
    });

    it('rejects malformed posts', () => {
      data.posts.push({ foo: 'bar' });

      return importData(space, contentTypes, data).then(() => {
        expect('should not end up here').to.eql(null);
      }, (err) => {
        expect(err.message).to.eql('Invalid post properties found: foo');
      });
    });

    it('rejects malformed tags', () => {
      data.tags.push({ name: 'General', slug: 'general', foo: 'bar' });

      return importData(space, contentTypes, data).then(() => {
        expect('should not end up here').to.eql(null);
      }, (err) => {
        expect(err.message).to.eql('Invalid tag properties found: foo');
      });
    });
  });
});
