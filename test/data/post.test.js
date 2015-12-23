'use strict';

import * as _ from 'lodash';
import { expect } from 'chai';
import { prepareApiStub, fakeContentTypes } from '../support/helper';
import * as Post from '../../src/data/post';
import * as sinon from 'sinon';
import { humanize } from 'underscore.string';

describe('post', () => {
  let env = prepareApiStub();
  let contentTypes = fakeContentTypes();

  describe('importData', () => {
    let space, data;

    beforeEach(() => {
      let posts = [{
        title: 'A generic data importer for blogs',
        slug: 'a-generic-data-importer-for-blogs',
        body: '**Various** information about the *importer*',
        publishedAt: '2014-08-19T22:00:00+02:00',
        metaTitle: 'Title for contentful-blog-importer post',
        metaDescription: 'Description for contentful-blog-importer post',
        author: 'slug-of-an-author',
        tags: [ 'slug-of-a-tag', 'slug-of-another-tag' ]
      }];

      data = { authors: [], posts, tags: [] };

      return env.importer.client.getSpace('space-id')
        .then((_space) => space = _space);
    });

    it('creates and publishes the posts', () => {
      let created = false;
      let published = false;
      let postContentType = _.extend(
        { sys: { id: 'post' } }, contentTypes.Post
      );
      let expectedFields = {
        title: { 'en-US': 'A generic data importer for blogs' },
        slug: { 'en-US': 'a-generic-data-importer-for-blogs' },
        body: { 'en-US': '**Various** information about the *importer*' },
        publishedAt: { 'en-US': '2014-08-19T22:00:00+02:00' },
        metaTitle: { 'en-US': 'Title for contentful-blog-importer post' },
        metaDescription: { 'en-US': 'Description for contentful-blog-importer post' },
        author: { 'en-US': { sys: { type: 'Link', linkType: 'Entry', id: 'slug-of-an-author'} } },
        tags: {
          'en-US': [
            { sys: { type: 'Link', linkType: 'Entry', id: 'slug-of-a-tag' } },
            { sys: { type: 'Link', linkType: 'Entry', id: 'slug-of-another-tag' } },
          ]
        }
      };

      env.app.put('/spaces/space-id/entries/a-generic-data-importer-for-blogs', (req, res) => {
        // Mark the entry as created
        created = true;

        // Ensure the right payload
        expect(req.body).to.eql({ fields: expectedFields });

        // Send a Contentful-esque response
        res.send({
          sys: { id: 'a-generic-data-importer-for-blogs', version: 1 },
          fields: expectedFields
        });
      });

      env.app.put('/spaces/space-id/entries/a-generic-data-importer-for-blogs/published', (req, res) => {
        // Mark the entry as published
        published = true;

        // Send a Contentful-esque response
        res.send({
          sys: { id: 'a-generic-data-importer-for-blogs', version: 2 },
          fields: expectedFields
        });
      });

      return Post.importData([], space, postContentType, data).then(() => {
        // All entries should be created now
        expect(created).to.eql(true);

        // All entries should be published now
        expect(published).to.eql(true);
      });
    });
  });
});
