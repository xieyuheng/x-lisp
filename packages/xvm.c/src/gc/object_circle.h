#pragma once

// holding state to support circular object.

struct object_circle_ctx_t {
  set_t *occurred_objects;
  hash_t *circle_indexes;
  // 输出语言 —— 值打印采用哪套容器关键字与字面量。
  lang_t lang;
};

object_circle_ctx_t *make_object_circle_ctx(void);
void object_circle_ctx_free(object_circle_ctx_t *self);

void object_circle_collect(object_circle_ctx_t *self, object_t *object);
bool is_object_circle_start(object_circle_ctx_t *self, object_t *object);
bool is_object_circle_end(object_circle_ctx_t *self, object_t *object);
size_t object_circle_index(object_circle_ctx_t *self, object_t *object);
void object_circle_meet(object_circle_ctx_t *self, object_t *object);
