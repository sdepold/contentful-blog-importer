'use strict';

import { ensureEntity } from './base';

export function ensure (space, contentTypes) {
  return ensureEntity(space, contentTypes, schema());
}

export function schema () {
  return {
    name: 'Tag',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol' },
      { id: 'slug', name: 'Slug', type: 'Symbol' }
    ]
  };
}
