'use strict';

import { expect } from 'chai';
import { prepareApiStub } from '../support/helper';
import ensureSchema from '../../src/schema';

describe('schema', () => {
  let env = prepareApiStub();

  describe('ensureSchema', () => {
    let space, createdSchema, publishedSchema;

    beforeEach(() => {
      createdSchema = { author: false, post: false, tag: false };
      publishedSchema = { author: false, post: false, tag: false };

      env.app.put('/spaces/space-id/content_types/:entity', (req, res) => {
        createdSchema[req.params.entity] = true;
        res.send({ sys: { id: req.params.entity, version: 1 } });
      });

      env.app.put('/spaces/space-id/content_types/:entity/published', (req, res) => {
        publishedSchema[req.params.entity] = true;
        res.send({ sys: { id: req.params.entity, version: 1 } });
      });

      return env.importer.client.getSpace('space-id').then((_space) => space = _space);
    });

    it('ensures every entity schema', () => {
      return ensureSchema(space).then(() => {
        expect(createdSchema).to.eql({ author: true, post: true, tag: true });
        expect(publishedSchema).to.eql({ author: true, post: true, tag: true });
      });
    });

    it('returns a hash with the entities', () => {
      return ensureSchema(space).then((entities) => {
        expect(entities.Author).to.eql({ sys: { id: 'author', version: 1 }, fields: [] });
        expect(entities.Post).to.eql({ sys: { id: 'post', version: 1 }, fields: [] });
        expect(entities.Tag).to.eql({ sys: { id: 'tag', version: 1 }, fields: [] });
      });
    });
  });
});
