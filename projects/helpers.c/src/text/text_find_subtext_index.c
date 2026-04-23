#include "index.h"

// static void
// build_kmp_table(const text_t *subtext, int kmp_table[]) {
//   size_t length = text_length(subtext);
//   kmp_table[0] = -1;
//   size_t i = 1;
//   size_t j = 0;
//   while (i < length) {
//     if (text_get_code_point(subtext, i) ==
//         text_get_code_point(subtext, j)) {
//       i++;
//       j++;
//       kmp_table[i] = j;
//     } else {
//       j = kmp_table[j];
//     }
//   }
// }

// int text_find_subtext_index(const text_t *self, const text_t *subtext) {

// }
