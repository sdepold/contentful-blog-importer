'use strict';

import { ensureEntity } from './base';

export function ensure (space, contentTypes) {
  return ensureEntity(space, contentTypes, schema());
}

export function schema () {
  return {
    name: 'Post',
    fields: [
      { id: 'title', name: 'Title', type: 'Symbol' },
      { id: 'slug', name: 'Slug', type: 'Symbol' },
      { id: 'body', name: 'Body', type: 'Text' },
      { id: 'publishedAt', name: 'Published At', type: 'Date' },
      { id: 'metaTitle', name: 'Meta Title', type: 'Symbol' },
      { id: 'metaDescription', name: 'Meta Description', type: 'Symbol' },
      { id: 'author', name: 'Author', type: 'Link', linkType: 'Entry' },
      { id: 'tags', name: 'Tags', type: 'Array', items: { type: 'Link', linkType: 'Entry' }}
    ]
  };
}
