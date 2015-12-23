'use strict';

import { importEntities, validateEntities } from './base';
import { schema } from '../schema/post';

export function importData (entries, space, contentType, data) {
  validateEntities(data.posts || [], 'post', schema());
  return importEntities(...arguments, 'post', mapData);
}

function mapData (post) {
  return {
    sys: { id: post.slug },
    fields: {
      title: { 'en-US': post.title },
      slug: { 'en-US': post.slug },
      body: { 'en-US': post.body },
      publishedAt: { 'en-US': post.publishedAt },
      metaTitle: { 'en-US': post.metaTitle },
      metaDescription: { 'en-US': post.metaDescription },
      author: { 'en-US': getAuthor(post) },
      tags: { 'en-US': getTags(post) }
    }
  };
}

function getTags (post) {
  return post.tags.map((tagSlug) => {
    return { sys: { type: 'Link', linkType: 'Entry', id: tagSlug } };
  });
}

function getAuthor (post) {
  return { sys: { type: 'Link', linkType: 'Entry', id: post.author } };
}
