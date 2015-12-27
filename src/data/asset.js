'use strict';

let mime     = require('mime');
let parseUrl = require('url').parse;
let questor  = require('questor');
let retry    = require('retry');
let slug     = require('slug');

import logger from '../logger';

export function importAsset (space, post, title, url) {
  return remoteResourceExists(url).then(() => {
    return maybeCreateAsset(space, post, title, url)
      .then((asset) => maybeProcessAsset(space, asset))
      .then((asset) => maybePublishAsset(space, asset));
  });
}

function maybeCreateAsset (space, post, title, url) {
  let id = `${post.slug}-${slug(title)}`.toLowerCase();

  return space.getAsset(id).then((asset) => {
    logger.info(`- The asset "${id}" already exists`);
    return asset;
  }, () => {
    let urlPath  = parseUrl(url).pathname;
    let mimeType = mime.lookup(urlPath);

    return space.createAsset({
      sys: { id: id },
      fields: {
        title: { 'en-US': title },
        file: {
          'en-US': {
            upload: url,
            contentType: mimeType,
            fileName: `${id}.${mime.extension(mimeType)}`
          }
        }
      }
    }).then((asset) => {
      logger.info(`- Created asset "${id}"`);
      return asset;
    });
  });
}

function maybeProcessAsset (space, asset) {
  let id = asset.sys.id;

  if (isProcessedAsset(asset)) {
    logger.info(`- The asset "${id}" is already processed`);
    return asset;
  } else {
    return processAsset(space, asset).then((asset) => {
      logger.info(`- Processed asset "${id}"`);
      return asset;
    });
  }
}

function maybePublishAsset (space, asset) {
  let id = asset.sys.id;

  return space.publishAsset(asset).then((asset) => {
    logger.info(`- Published asset "${id}"`);
    return asset;
  });
}

function remoteResourceExists (url) {
  return questor(url, { method: 'HEAD' });
}

function isProcessedAsset (asset) {
  return !!asset.fields.file['en-US'].url;
}

function processAsset (space, asset) {
  return space.processAssetFile(asset, 'en-US').then(function () {
    return waitForAssetProcessing(space, asset.sys.id);
  });
}

function waitForAssetProcessing (space, assetId) {
  return new Promise((resolve, reject) => {
    let operation = retry.operation();

    operation.attempt(() => {
      space.getAsset(assetId).then((asset) => {
        if (isProcessedAsset(asset)) {
          return resolve(asset);
        }

        let err = new Error('Asset not yet processed!');

        if (!operation.retry(err)) {
          reject(err);
        }
      });
    });
  });
}
