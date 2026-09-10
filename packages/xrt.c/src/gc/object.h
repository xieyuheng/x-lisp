#pragma once

typedef bool (object_equal_fn_t)(object_t *lhs, object_t *rhs);
typedef void (object_write_fn_t)(buffer_t *buffer, object_circle_ctx_t *ctx, object_t *self);
typedef hash_code_t (object_hash_code_fn_t)(object_t *self);
typedef ordering_t (object_compare_fn_t)(object_t *lhs, object_t *rhs);

typedef void (object_visit_child_fn_t)(object_t *child, void *ctx);
typedef void (object_for_each_child_fn_t)(object_t *self,
                                          object_visit_child_fn_t *visit,
                                          void *ctx);

struct object_class_t {
  const char *name;
  object_equal_fn_t *equal_fn;
  object_write_fn_t *write_fn;
  object_hash_code_fn_t *hash_code_fn;
  object_compare_fn_t *compare_fn;

  // - null means this object is permanent.
  free_fn_t *free_fn;

  // - visit each object-valued child (immediates are skipped);
  // - null means this object has no children.
  object_for_each_child_fn_t *for_each_child_fn;
};

// - `GC_OLD == 0` on purpose: `calloc`-allocated objects default to old,
//   so static objects are never mistaken for young.
typedef enum {
  GC_OLD = 0,
  GC_YOUNG = 1,
} gc_generation_t;

struct object_header_t {
  const object_class_t *class;
  bool mark;
  bool is_static;
  uint8_t generation;
  uint8_t remembered;
};

struct object_t {
  struct object_header_t header;
};

static_assert(sizeof(struct object_header_t) == 16,
              "object_header_t must stay 16 bytes for the payload layout");

void object_free(object_t *self);

void write_object(buffer_t *buffer, object_circle_ctx_t *ctx, object_t *self);
void print_object(object_circle_ctx_t *ctx, object_t *self);
