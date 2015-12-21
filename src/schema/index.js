'use strict';

import * as Author from './author';
import * as Post from './post';
import * as Tag from './tag';

export default function ensureSchema (space) {
  return space.getContentTypes().then((contentTypes) => {
    return Promise.all([
      Author.ensure(space, contentTypes),
      Post.ensure(space, contentTypes),
      Tag.ensure(space, contentTypes)
    ]);
  }).then((contentTypes) => {
    return {
      Author: contentTypes[0],
      Post: contentTypes[1],
      Tag: contentTypes[2]
    };
  });
}
