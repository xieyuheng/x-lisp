#include <stdlib.h>
#include <time.h>

#include "index.h"

bool gc_barrier_disabled = false;
size_t gc_barrier_calls = 0;
static size_t gc_major_floor = 4 * 1024 * 1024;

struct gc_t {
  array_t *old_objects;
  array_t *young_objects;
  array_t *remembered;
  stack_t *work_stack;

  size_t young_threshold;
  size_t major_threshold;

  // - statistics
  size_t objects_allocated;
  size_t minor_count;
  size_t major_count;
  size_t minor_marked_objects;
  size_t minor_freed_objects;
  size_t major_marked_objects;
  size_t major_freed_objects;
  size_t roots_scanned;
  size_t remembered_scanned;
  size_t children_visited;
  size_t child_traversals;
  size_t barrier_hits;
  double minor_mark_time;
  double minor_sweep_time;
  double major_mark_time;
  double major_sweep_time;
};

static double now_s(void) {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return (double) ts.tv_sec + (double) ts.tv_nsec / 1e9;
}

gc_t *make_gc(void) {
  gc_t *self = new(gc_t);
  self->old_objects = make_array();
  self->young_objects = make_array();
  self->remembered = make_array();
  self->work_stack = make_stack();
  self->young_threshold = 4096;
  self->major_threshold = 4096;
  if (getenv("XVM_GC_STRESS")) self->young_threshold = 1;
  char *floor_env = getenv("XVM_GC_MAJOR_FLOOR");
  if (floor_env) gc_major_floor = (size_t) strtoull(floor_env, NULL, 10);
  if (gc_major_floor > 0) self->major_threshold = gc_major_floor;
  if (getenv("XVM_GC_OFF")) {
    self->young_threshold = (size_t) -1;
    self->major_threshold = (size_t) -1;
  }
  if (getenv("XVM_GC_NO_BARRIER")) gc_barrier_disabled = true;
  return self;
}

void gc_free(gc_t *self) {
  for (size_t i = 0; i < array_length(self->old_objects); i++) {
    object_free(array_get(self->old_objects, i));
  }
  for (size_t i = 0; i < array_length(self->young_objects); i++) {
    object_free(array_get(self->young_objects, i));
  }
  array_free(self->old_objects);
  array_free(self->young_objects);
  array_free(self->remembered);
  stack_free(self->work_stack);
  free(self);
}

size_t gc_object_count(gc_t *self) {
  return array_length(self->old_objects) + array_length(self->young_objects);
}

size_t gc_young_count(gc_t *self) {
  return array_length(self->young_objects);
}

size_t gc_old_count(gc_t *self) {
  return array_length(self->old_objects);
}

void gc_add_object(gc_t *self, object_t *object) {
  object->header.generation = GC_YOUNG;
  object->header.remembered = false;
  object->header.mark = false;
  array_push(self->young_objects, object);
  self->objects_allocated += 1;
}

void gc_remember(gc_t *self, object_t *object) {
  if (object->header.remembered) return;
  object->header.remembered = true;
  array_push(self->remembered, object);
  self->barrier_hits += 1;
}

// - mark children, calling `mark` on each object-valued child.

typedef struct {
  gc_t *self;
  void (*mark)(gc_t *, object_t *);
} gc_mark_ctx_t;

static void gc_visit_child(object_t *child, void *ctx_) {
  gc_mark_ctx_t *ctx = ctx_;
  ctx->self->children_visited += 1;
  ctx->mark(ctx->self, child);
}

static void gc_mark_children(gc_t *self, object_t *object,
                             void (*mark)(gc_t *, object_t *)) {
  const object_class_t *class = object->header.class;
  if (!class->for_each_child_fn) return;

  self->child_traversals += 1;
  gc_mark_ctx_t ctx = { .self = self, .mark = mark };
  class->for_each_child_fn(object, gc_visit_child, &ctx);
}

static void gc_mark_drain(gc_t *self, void (*mark)(gc_t *, object_t *)) {
  while (!stack_is_empty(self->work_stack)) {
    object_t *object = stack_pop(self->work_stack);
    gc_mark_children(self, object, mark);
  }
}

// - major marking: trace everything.

static void gc_mark_object(gc_t *self, object_t *object) {
  if (object->header.is_static) return;
  if (object->header.mark) return;
  object->header.mark = true;
  self->major_marked_objects += 1;

  const object_class_t *class = object->header.class;
  if (class->for_each_child_fn) {
    stack_push(self->work_stack, object);
  }
}

// - minor marking: trace young only, never into old objects.

static void gc_minor_mark_object(gc_t *self, object_t *object) {
  if (object->header.is_static) return;
  if (object->header.generation != GC_YOUNG) return;
  if (object->header.mark) return;
  object->header.mark = true;
  self->minor_marked_objects += 1;

  const object_class_t *class = object->header.class;
  if (class->for_each_child_fn) {
    stack_push(self->work_stack, object);
  }
}

static void gc_minor_mark(gc_t *self, array_t *roots) {
  self->roots_scanned += array_length(roots);
  self->remembered_scanned += array_length(self->remembered);

  for (size_t i = 0; i < array_length(roots); i++) {
    gc_minor_mark_object(self, array_get(roots, i));
  }

  // - old objects in the remembered set are extra roots for their young children.
  for (size_t i = 0; i < array_length(self->remembered); i++) {
    gc_mark_children(self, array_get(self->remembered, i),
                     gc_minor_mark_object);
  }

  gc_mark_drain(self, gc_minor_mark_object);
}

static void gc_check_visit(object_t *child, void *ctx) {
  (void) ctx;
  if (child->header.generation == GC_YOUNG && !child->header.mark) {
    who_printf("gc invariant violated: "
               "old -> young edge without write barrier\n");
    abort();
  }
}

// - debug: after minor marking, no old object may point to an unmarked young
//   object -- that would mean a missing write barrier.
static void gc_minor_check_invariant(gc_t *self) {
  if (!getenv("XVM_GC_CHECK")) return;

  for (size_t i = 0; i < array_length(self->old_objects); i++) {
    object_t *object = array_get(self->old_objects, i);
    const object_class_t *class = object->header.class;
    if (!class->for_each_child_fn) continue;
    class->for_each_child_fn(object, gc_check_visit, NULL);
  }
}

static void gc_clear_remembered(gc_t *self) {
  for (size_t i = 0; i < array_length(self->remembered); i++) {
    object_t *object = array_get(self->remembered, i);
    object->header.remembered = false;
  }
  array_purge(self->remembered);
}

// - minor collection: survivors are promoted in place (no copying).

static void gc_minor(gc_t *self, array_t *roots) {
  size_t young_before = array_length(self->young_objects);
  size_t old_before = array_length(self->old_objects);

  double t0 = now_s();
  gc_minor_mark(self, roots);
  gc_minor_check_invariant(self);
  self->minor_mark_time += now_s() - t0;

  t0 = now_s();
  for (size_t i = 0; i < array_length(self->young_objects); i++) {
    object_t *object = array_get(self->young_objects, i);
    if (object->header.mark) {
      object->header.mark = false;
      object->header.generation = GC_OLD;
      array_push(self->old_objects, object);
    } else {
      object_free(object);
      self->minor_freed_objects += 1;
    }
  }

  array_purge(self->young_objects);
  gc_clear_remembered(self);
  self->minor_sweep_time += now_s() - t0;

  size_t survived = array_length(self->old_objects) - old_before;
  if (survived * 4 > young_before) {
    self->young_threshold *= 2;
    if (self->young_threshold > (size_t) (1 << 20)) {
      self->young_threshold = 1 << 20;
    }
  } else {
    self->young_threshold = survived * 4;
    if (self->young_threshold < 1024) {
      self->young_threshold = 1024;
    }
  }

  self->minor_count += 1;
}

// - major collection: full mark-sweep; survivors all become old.

static void gc_major(gc_t *self, array_t *roots) {
  size_t before = gc_object_count(self);

  double t0 = now_s();
  for (size_t i = 0; i < array_length(roots); i++) {
    gc_mark_object(self, array_get(roots, i));
  }
  gc_mark_drain(self, gc_mark_object);
  self->major_mark_time += now_s() - t0;

  t0 = now_s();
  array_t *new_old = make_array();

  for (size_t i = 0; i < array_length(self->old_objects); i++) {
    object_t *object = array_get(self->old_objects, i);
    if (object->header.mark) {
      object->header.mark = false;
      array_push(new_old, object);
    } else {
      object_free(object);
      self->major_freed_objects += 1;
    }
  }

  for (size_t i = 0; i < array_length(self->young_objects); i++) {
    object_t *object = array_get(self->young_objects, i);
    if (object->header.mark) {
      object->header.mark = false;
      object->header.generation = GC_OLD;
      array_push(new_old, object);
    } else {
      object_free(object);
      self->major_freed_objects += 1;
    }
  }

  array_free(self->old_objects);
  self->old_objects = new_old;
  array_purge(self->young_objects);
  gc_clear_remembered(self);
  self->major_sweep_time += now_s() - t0;

  size_t after = gc_object_count(self);
  size_t freed = before - after;
  if (freed < before / 10) {
    self->major_threshold = before * 2;
  } else {
    self->major_threshold = after * 2;
  }
  if (self->major_threshold < 1024) {
    self->major_threshold = 1024;
  }
  if (self->major_threshold < gc_major_floor) {
    self->major_threshold = gc_major_floor;
  }

  self->major_count += 1;
}

bool gc_should_collect(gc_t *self) {
  return array_length(self->young_objects) >= self->young_threshold
    || array_length(self->old_objects) >= self->major_threshold;
}

gc_collect_kind_t gc_collect(gc_t *self, array_t *roots) {
  if (gc_barrier_disabled
      || array_length(self->old_objects) >= self->major_threshold) {
    gc_major(self, roots);
    return GC_COLLECT_MAJOR;
  }

  gc_minor(self, roots);
  return GC_COLLECT_MINOR;
}

void gc_report(gc_t *self) {
  if (gc_object_count(self) == 0) {
    printf("objects: (empty)\n");
    return;
  }

  printf("objects: old=%zu young=%zu\n",
         array_length(self->old_objects),
         array_length(self->young_objects));

  array_t *all = make_array();
  for (size_t i = 0; i < array_length(self->old_objects); i++) {
    array_push(all, array_get(self->old_objects, i));
  }
  for (size_t i = 0; i < array_length(self->young_objects); i++) {
    array_push(all, array_get(self->young_objects, i));
  }

  for (size_t i = 0; i < array_length(all); i++) {
    object_t *object = array_get(all, i);
    object_circle_ctx_t *ctx = make_object_circle_ctx();
    printf("  %ld: ", i); print_object(ctx, object); printf("\n");
    object_circle_ctx_free(ctx);
  }
  array_free(all);
}

void gc_print_stats(gc_t *self) {
  who_printf("allocated=%zu minor=%zu major=%zu old=%zu "
             "young_threshold=%zu major_threshold=%zu\n",
             self->objects_allocated, self->minor_count, self->major_count,
             array_length(self->old_objects),
             self->young_threshold, self->major_threshold);
  who_printf("minor: mark=%.3fs sweep=%.3fs marked=%zu freed=%zu\n",
             self->minor_mark_time, self->minor_sweep_time,
             self->minor_marked_objects, self->minor_freed_objects);
  who_printf("major: mark=%.3fs sweep=%.3fs marked=%zu freed=%zu\n",
             self->major_mark_time, self->major_sweep_time,
             self->major_marked_objects, self->major_freed_objects);
  who_printf("scan: roots=%zu remembered=%zu child_traversals=%zu "
             "children_visited=%zu barrier_hits=%zu\n",
             self->roots_scanned, self->remembered_scanned,
             self->child_traversals, self->children_visited,
             self->barrier_hits);
  who_printf("barrier_calls=%zu\n", gc_barrier_calls);
}
