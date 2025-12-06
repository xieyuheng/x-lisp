#pragma once

struct vm_t {
    path_t *path;
    char *text;
    hash_t *definitions;
    // array_t *placeholders;
};
