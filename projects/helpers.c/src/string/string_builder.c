#include "index.h"

struct string_builder_t {
    char *buffer;
    size_t length;
    // buffer size is max_length + 1 (the null end)
    size_t max_length;
};
