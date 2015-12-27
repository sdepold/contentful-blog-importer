'use strict';

import { importEntities, validateEntities } from './base';
import { schema } from '../schema/post';
import logger from '../logger';
import { importAsset} from './asset';

export function importData (entries, space, contentType, data) {
  validateEntities(data.posts || [], 'post', schema());
  return importEntities(...arguments, 'post', (post) => mapData(space, post));
}

function mapData (space, post) {
  return replaceEmbeddings(space, post).then((post) => {
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
  });
}

function getTags (post) {
  return (post.tags || []).map((tagSlug) => {
    return { sys: { type: 'Link', linkType: 'Entry', id: tagSlug } };
  });
}

function getAuthor (post) {
  return { sys: { type: 'Link', linkType: 'Entry', id: post.author } };
}

function replaceEmbeddings (space, post) {
  let matches = post.body.match(/!\[.*?\]\(.+?\)/g) || [];

  return Promise.all(matches.map((match, index) => {
    let fragments = match.match(/!\[(.*)\]\((.*)\)/);
    let title     = fragments[1] || `image-${index}`;
    let url       = fragments[2];

    return importAsset(space, post, title, url).then(
      (asset) => [url, asset],
      (err) => {
        logger.warn('Asset import failed: ', err.message);
      }
    );
  })).then((assetMap) => {
    assetMap.forEach((mapEntry) => {
      if (mapEntry) {
        let oldPath = mapEntry[0];
        let asset   = mapEntry[1];

        post.body = post.body.replace(oldPath, asset.fields.file['en-US'].url);
      }
    });

    return post;
  });
}
