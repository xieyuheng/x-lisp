#include "index.h"

const object_class_t xfile_class = {
    .name = "file",
    // .equal_fn = (object_equal_fn_t *) xfile_equal,
    // .print_fn = (object_print_fn_t *) xfile_print,
    // .hash_code_fn = (object_hash_code_fn_t *) xfile_hash_code,
    // .compare_fn = (object_compare_fn_t *) xfile_compare,
    .free_fn = (free_fn_t *) xfile_free,
};

xfile_t *
make_xfile(file_t *file) {
    xfile_t *self = new(xfile_t);
    self->header.class = &xfile_class;
    self->file = file;
    self->open_p = true;
    gc_add_object(global_gc, (object_t *) self);
    return self;
}

void
xfile_free(xfile_t *self) {
    xfile_close(self);
    if (self->pathname) {
        string_free(self->pathname);
    }

    free(self);
}

xfile_t *
open_input_xfile(char *pathname) {
    file_t *file = open_file_or_fail(pathname, "r");
    xfile_t *xfile = make_xfile(file);
    xfile->pathname = pathname;
    return xfile;
}

xfile_t *
open_output_xfile(char *pathname) {
    file_t *file = open_file_or_fail(pathname, "w");
    xfile_t *xfile = make_xfile(file);
    xfile->pathname = pathname;
    return xfile;
}

void
xfile_close(xfile_t *self) {
    if (self->open_p) {
        file_close(self->file);
        self->open_p = false;
    }
}
