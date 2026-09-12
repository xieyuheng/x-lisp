#include "index.h"

static void xfile_copy(object_t *dest, const object_t *src,
                       object_forward_value_fn_t *forward);
static void xfile_forward(object_t *self, object_forward_value_fn_t *forward);
static void xfile_destroy(object_t *self);

const object_class_t xfile_class = {
  .name = "file",
  .equal_fn = (object_equal_fn_t *) xfile_equal,
  .write_fn = (object_write_fn_t *) write_xfile,
  .hash_code_fn = (object_hash_code_fn_t *) xfile_hash_code,
  .compare_fn = (object_compare_fn_t *) xfile_compare,
  .free_fn = (free_fn_t *) xfile_free,
  .copy_fn = (object_copy_fn_t *) xfile_copy,
  .forward_fn = (object_forward_fn_t *) xfile_forward,
  .destroy_fn = (object_destroy_fn_t *) xfile_destroy,
};

xfile_t *make_xfile(file_t *file) {
  xfile_t *self = gc_new(sizeof(xfile_t));
  self->header.class = &xfile_class;
  self->file = file;
  self->is_open = true;
  gc_add_object(global_gc, (object_t *) self);
  return self;
}

static array_t *static_xfiles = NULL;

xfile_t *make_static_xfile(file_t *file) {
  if (!static_xfiles) {
    static_xfiles = make_array();
  }

  xfile_t *self = new(xfile_t);
  self->header.class = &xfile_class;
  self->header.is_static = true;
  self->file = file;
  self->is_open = true;

  array_push(static_xfiles, self);
  return self;
}

static void xfile_copy(object_t *dest_, const object_t *src_,
                       object_forward_value_fn_t *forward) {
  (void) forward;
  xfile_t *dest = (xfile_t *) dest_;
  const xfile_t *src = (const xfile_t *) src_;
  dest->file = src->file;
  dest->is_open = src->is_open;
  dest->pathname = src->pathname;   // - transfer ownership
}

static void xfile_forward(object_t *self, object_forward_value_fn_t *forward) {
  (void) self; (void) forward;
}

static void xfile_destroy(object_t *self_) {
  xfile_t *self = (xfile_t *) self_;
  xfile_close(self);
  if (self->pathname) {
    string_free(self->pathname);
  }
}

void xfile_free(xfile_t *self) {
  xfile_destroy((object_t *) self);
  free(self);
}

xfile_t *open_input_xfile(char *pathname) {
  file_t *file = open_file_or_fail(pathname, "r");
  xfile_t *xfile = make_xfile(file);
  xfile->pathname = pathname;
  return xfile;
}

xfile_t *open_output_xfile(char *pathname) {
  file_t *file = open_file_or_fail(pathname, "w");
  xfile_t *xfile = make_xfile(file);
  xfile->pathname = pathname;
  return xfile;
}

void xfile_close(xfile_t *self) {
  if (self->is_open) {
    file_close(self->file);
    self->is_open = false;
  }
}

bool is_xfile(value_t value) {
  return is_object(value) &&
    to_object(value)->header.class == &xfile_class;
}

xfile_t *to_xfile(value_t value) {
  assert(is_xfile(value));
  return (xfile_t *) to_object(value);
}

bool xfile_equal(const xfile_t *lhs, const xfile_t *rhs) {
  return lhs->file == rhs->file;
}

void write_xfile(buffer_t *buffer, object_circle_ctx_t *ctx, const xfile_t *self) {
  (void) ctx;
  write_string(buffer, "#(file ");
  write_int(buffer, file_raw_fd(self->file));
  if (self->pathname) {
    write_string(buffer, " ");
    write_string(buffer, self->pathname);
  }

  write_string(buffer, ")");
}

hash_code_t xfile_hash_code(const xfile_t *self) {
  if (self->pathname) {
    return file_raw_fd(self->file);
  } else {
    return file_raw_fd(self->file);
  }
}

ordering_t xfile_compare(const xfile_t *lhs, const xfile_t *rhs){
  return file_raw_fd(lhs->file) - file_raw_fd(rhs->file);
}

char *xfile_read(xfile_t *self) {
  return file_read_string(self->file);
}

void xfile_write(xfile_t *self, const char *string) {
  file_write_string(self->file, string);
}
