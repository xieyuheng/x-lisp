#include "index.h"

static bool match_from(const text_t *self, const text_t *subtext, size_t i) {
  for (size_t j = 0; j < text_length(subtext); j++) {
    if (text_get_code_point(self, i + j) != text_get_code_point(subtext, j)) {
      return false;
    }
  }

  return true;
}

int text_find_subtext_index(const text_t *self, const text_t *subtext) {
  for (size_t i = 0; i < text_length(self); i++) {
    if (match_from(self, subtext, i)) {
      return i;
    }
  }

  return -1;
}
