'use strict';

import { expect } from 'chai';
import ContentfulBlogImporter from '../src/contentful-blog-importer';
import { prepareApiStub } from './support/helper';
import * as sinon from 'sinon';

describe('ContentfulBlogImporter', () => {
  let env = prepareApiStub();

  describe('constructor', () => {
    it('throws an error of the mendatory params are not passed', () => {
      expect(() => {
        new ContentfulBlogImporter();
      }).to.throw('Missing parameter "spaceId"!');

      expect(() => {
        new ContentfulBlogImporter('space-id');
      }).to.throw('Missing parameter "cmaToken"!');
    });

    it('sets a default host option', () => {
      let importer = new ContentfulBlogImporter('space-id', 'cma-token');

      expect(importer.options.host).to.eql('api.contentful.com');
    });
  });

  describe('run', () => {
    it('ensures the schema', () => {
      let schemaMock = sinon.mock(env.importer);

      return env.importer.client.getSpace('space-id').then((space) => {
        schemaMock.expects('_ensureSchema')
          .once()
          .withArgs(space)
          .returns(new Promise((resolve) => {
            resolve([space, {
              Author: { sys: { id: 'author', version: 1 }, fields: [] },
              Post: { sys: { id: 'post', version: 1 }, fields: [] },
              Tag: { sys: { id: 'tag', version: 1 }, fields: [] }
            }]);
          }));

        return env.importer.run();
      });
    });
  });
});
