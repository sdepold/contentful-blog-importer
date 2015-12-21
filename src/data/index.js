'use strict';

import * as Author from './author';
import * as Post from './post';
import * as Tag from './tag';

export default function importData (space, contentTypes, data) {
  return space.getEntries().then((entries) => {
    return Promise.all([
      Author.importData(entries, space, contentTypes.Author, data),
      // Post.importData(entries, space, contentTypes.Post, data),
      Tag.importData(entries, space, contentTypes.Tag, data)
      // importTags(entries, space, contentTypes, data),
      // importPosts(entries, space, contentTypes, data)
    ]);
  });
}
//
// function importUsers (entries, space, contentTypes, data) {
//   return validateUsersData
//
//   // return importEntities(...arguments, 'user', (user) => {
//   //   return {
//   //     sys: { id: user.slug },
//   //     fields: {
//   //       name: { 'en-US': user.name },
//   //       slug: { 'en-US': user.slug },
//   //       email: { 'en-US': user.email },
//   //       image: { 'en-US': user.image }
//   //     }
//   //   };
//   // });
// }
//
// function importTags (entries, space, contentTypes, data) {
//   return importEntities(...arguments, 'tag', (tag) => {
//     return {
//       sys: { id: tag.slug },
//       fields: {
//         name: { 'en-US': tag.name },
//         slug: { 'en-US': tag.slug }
//       }
//     };
//   });
// }
