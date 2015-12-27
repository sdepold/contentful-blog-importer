'use strict';

import * as _ from 'lodash';
import { expect } from 'chai';
import { prepareApiStub, fakeContentTypes } from '../support/helper';
import * as Post from '../../src/data/post';

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
      let postContentType = _.extend({ sys: { id: 'post' } }, contentTypes.Post);
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
            { sys: { type: 'Link', linkType: 'Entry', id: 'slug-of-another-tag' } }
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

      env.app.put(
        '/spaces/space-id/entries/a-generic-data-importer-for-blogs/published',
        (req, res) => {
          // Mark the entry as published
          published = true;

          // Send a Contentful-esque response
          res.send({
            sys: { id: 'a-generic-data-importer-for-blogs', version: 2 },
            fields: expectedFields
          });
        }
      );

      return Post.importData([], space, postContentType, data).then(() => {
        // All entries should be created now
        expect(created).to.eql(true);

        // All entries should be published now
        expect(published).to.eql(true);
      });
    });

    it('replaces embeddings with assets', () => {
      data.posts[0] = {
        title: 'A post',
        slug: 'a-post',
        body: '![hello world](http://localhost:3000/nice-pic.jpg)'
      };

      let asset = { created: false, processed: false, published: false };
      let postContentType = _.extend({ sys: { id: 'post' } }, contentTypes.Post);
      let expectedPostFields = {
        title: { 'en-US': 'A post' },
        slug: { 'en-US': 'a-post' },
        // The embedded image is replaced with an asset on contentful.
        body: { 'en-US': '![hello world](https://images.contentful.com/a-post-hello-world.jpeg)' },
        publishedAt: {},
        metaTitle: {},
        metaDescription: {},
        author: { 'en-US': { sys: { type: 'Link', linkType: 'Entry' } } },
        tags: { 'en-US': [] }
      };
      let getCallCount = 0;

      env.app.put('/spaces/space-id/entries/a-post', (req, res) => {
        expect(req.body).to.eql({ fields: expectedPostFields });
        res.send({ sys: { id: 'a-post', version: 1 }, fields: expectedPostFields });
      });

      env.app.put('/spaces/space-id/entries/a-post/published', (req, res) => {
        res.send({ sys: { id: 'a-post', version: 2 }, fields: expectedPostFields });
      });

      env.app.head('/nice-pic.jpg', (req, res) => {
        res.send('foo');
      });

      env.app.get('/spaces/space-id/assets/a-post-hello-world', (req, res) => {
        getCallCount++;

        if (getCallCount === 1) {
          return res.status(404).send('NotFound');
        }

        let fields = {
          title: { 'en-US': 'hello world' },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: 'a-post-hello-world.jpeg',
              url: 'https://images.contentful.com/a-post-hello-world.jpeg'
            }
          }
        };

        return res.send({ sys: { id: 'a-post-hello-world', version: 2 }, fields });
      });

      env.app.put('/spaces/space-id/assets/a-post-hello-world', (req, res) => {
        asset.created = true;

        let fields = {
          title: { 'en-US': 'hello world' },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: 'a-post-hello-world.jpeg',
              upload: 'http://localhost:3000/nice-pic.jpg'
            }
          }
        };

        expect(req.body).to.eql({ sys: { id: 'a-post-hello-world' }, fields });
        return res.send({ sys: { id: 'a-post-hello-world', version: 1 }, fields });
      });

      env.app.put('/spaces/space-id/assets/a-post-hello-world/files/en-US/process', (req, res) => {
        asset.processed = true;
        return res.status(204).send();
      });

      env.app.put('/spaces/space-id/assets/a-post-hello-world/published', (req, res) => {
        asset.published = true;

        let fields = {
          title: { 'en-US': 'hello world' },
          file: {
            'en-US': {
              contentType: 'image/jpeg',
              fileName: 'a-post-hello-world.jpeg',
              url: 'https://images.contentful.com/a-post-hello-world.jpeg'
            }
          }
        };

        return res.send({ sys: { id: 'a-post-hello-world', version: 3 }, fields });
      });

      return Post.importData([], space, postContentType, data).then(() => {
        expect(asset).to.eql({ created: true, processed: true, published: true });
      });
    });
  });
});
