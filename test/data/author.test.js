'use strict';

import * as _ from 'lodash';
import { expect } from 'chai';
import { prepareApiStub, fakeContentTypes } from '../support/helper';
import * as Author from '../../src/data/author';
import * as sinon from 'sinon';
import { humanize } from 'underscore.string';

describe('author', () => {
  let env = prepareApiStub();
  let contentTypes = fakeContentTypes();

  describe('importData', () => {
    let space, data;

    beforeEach(() => {
      let authors = [{
        name: 'John Doe',
        slug: 'john-doe',
        email: 'john@doe.com',
        image: 'TBD.jpg'
      }];

      data = { authors, posts: [], tags: [] };

      return env.importer.client.getSpace('space-id')
        .then((_space) => space = _space);
    });

    it('creates and publishes the authors', () => {
      let created = false;
      let published = false;
      let authorContentType = _.extend(
        { sys: { id: 'author' } }, contentTypes.Author
      );

      let fields = {
        name: { 'en-US': 'John Doe' },
        slug: { 'en-US': 'john-doe' },
        email: { 'en-US': 'john@doe.com' },
        image: { 'en-US': 'TBD.jpg' }
      };

      env.app.put('/spaces/space-id/entries/john-doe', (req, res) => {
        // Mark the entry as created
        created = true;

        // Ensure the right payload
        expect(req.body).to.eql({ fields });

        // Send a Contentful-esque response
        res.send({ sys: { id: 'john-doe', version: 1 }, fields });
      });

      env.app.put('/spaces/space-id/entries/john-doe/published', (req, res) => {
        // Mark the entry as published
        published = true;

        // Send a Contentful-esque response
        res.send({ sys: { id: 'john-doe', version: 2 }, fields });
      });

      return Author.importData([], space, authorContentType, data).then(() => {
        // All entries should be created now
        expect(created).to.eql(true);

        // All entries should be published now
        expect(published).to.eql(true);
      });
    });
  });
});
