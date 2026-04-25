#pragma once

extern const object_class_t xfile_class;

struct xfile_t {
  struct object_header_t header;
  file_t *file;
  bool open_p;
  char *pathname; // optional
};

xfile_t *make_xfile(file_t *file);
void xfile_free(xfile_t *self);

xfile_t *open_input_xfile(char *pathname);
xfile_t *open_output_xfile(char *pathname);
void xfile_close(xfile_t *self);

bool xfile_p(value_t value);
xfile_t *to_xfile(value_t value);

bool xfile_equal(const xfile_t *lhs, const xfile_t *rhs);
void xfile_format(buffer_t *buffer, object_circle_ctx_t *ctx, const xfile_t *self);
hash_code_t xfile_hash_code(const xfile_t *self);
ordering_t xfile_compare(const xfile_t *lhs, const xfile_t *rhs);

char *xfile_read(xfile_t *self);
void xfile_write(xfile_t *self, const char *string);
