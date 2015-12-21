'use strict';

import { ensureEntity } from './base';

export function ensure (space, contentTypes) {
  return ensureEntity(space, contentTypes, schema());
}

export function schema () {
  return {
    name: 'Author',
    fields: [
      { id: 'name', name: 'Name', type: 'Symbol' },
      { id: 'slug', name: 'Slug', type: 'Symbol' },
      { id: 'email', name: 'Email', type: 'Symbol' },
      { id: 'image', name: 'Image', type: 'Symbol' }
    ]
  };
}
