'use strict';

import * as Author from './author';
import * as Post from './post';
import * as Tag from './tag';

export default function importData (space, contentTypes, data) {
  return space.getEntries().then((entries) => {
    return Promise.all([
      Author.importData(entries, space, contentTypes.Author, data),
      Post.importData(entries, space, contentTypes.Post, data),
      Tag.importData(entries, space, contentTypes.Tag, data)
    ]);
  });
}
