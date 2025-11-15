#include "index.h"

value_t
x_little(const char *target) {
    assert(string_length(target) <= 7);
    uint64_t little = X_LITTLE;
    for (size_t i = 0; i < string_length(target); i++) {
        little = little | target[i] << (8 - i - 1) * 8;
    }

    return (value_t) little;
}

bool
little_p(value_t value) {
    return value_tag(value) == X_LITTLE;
}

void
little_copy(value_t little, char *target) {
    target[7] = '\0';
    for (size_t i = 0; i < 7; i++) {
        target[i] = (uint64_t) little >> (8 - i - 1) * 8;
    }
}

bool
little_hashtag_p(value_t x) {
    return little_p(x) && ((uint64_t) x >> (7 * 8) == '#');
}
