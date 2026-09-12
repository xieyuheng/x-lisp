#include <stdlib.h>
#include <time.h>

#include "index.h"
#include "../value/object.h"

bool gc_barrier_disabled = false;
size_t gc_barrier_calls = 0;
static size_t gc_major_floor = 4 * 1024 * 1024;
static bool gc_stats_enabled = false;

#define GC_NURSERY_BLOCK_SIZE (256 * 1024)

#define GC_CLASS_STATS_MAX 32
typedef struct {
  const object_class_t *class;
  size_t allocated;
  size_t promoted;
  size_t destroyed;
  size_t inner_bytes_sum;
  size_t inner_bytes_max;
} gc_class_stats_t;
static gc_class_stats_t gc_class_stats[GC_CLASS_STATS_MAX];
static size_t gc_class_stats_count = 0;

static gc_class_stats_t *gc_class_stats_for(const object_class_t *class) {
  for (size_t i = 0; i < gc_class_stats_count; i++) {
    if (gc_class_stats[i].class == class) return &gc_class_stats[i];
  }
  if (gc_class_stats_count >= GC_CLASS_STATS_MAX) return NULL;
  gc_class_stats_t *stats = &gc_class_stats[gc_class_stats_count++];
  memory_clear(stats, sizeof(*stats));
  stats->class = class;
  return stats;
}

typedef struct nursery_block_t {
  uint8_t *bytes;
  size_t capacity;
  size_t used;
} nursery_block_t;

struct gc_t {
  array_t *old_objects;
  array_t *young_objects;
  // - young objects whose class owns an inner buffer (need destroy_fn).
  array_t *young_resource_objects;
  array_t *remembered;
  stack_t *work_stack;

  array_t *nursery_blocks;
  nursery_block_t *nursery_current;
  size_t nursery_bytes;
  size_t nursery_peak_bytes;

  size_t young_threshold;
  size_t major_threshold;

  // - statistics
  size_t objects_allocated;
  size_t minor_count;
  size_t major_count;
  size_t minor_promoted_objects;
  size_t minor_freed_objects;
  size_t major_marked_objects;
  size_t major_freed_objects;
  size_t roots_scanned;
  size_t remembered_scanned;
  size_t children_visited;
  size_t child_traversals;
  size_t barrier_hits;
  size_t nursery_blocks_allocated;
  size_t minor_resource_scanned;
  size_t minor_resource_destroyed;
  size_t copied_bytes;
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

static size_t align8(size_t size) {
  return (size + 7) & ~((size_t) 7);
}

// - nursery

static void gc_nursery_alloc_block(gc_t *self, size_t size) {
  if (size < GC_NURSERY_BLOCK_SIZE) size = GC_NURSERY_BLOCK_SIZE;
  nursery_block_t *block = new(nursery_block_t);
  block->bytes = allocate(size);
  block->capacity = size;
  block->used = 0;
  array_push(self->nursery_blocks, block);
  self->nursery_current = block;
  self->nursery_blocks_allocated += 1;
}

static void *gc_nursery_alloc(gc_t *self, size_t size) {
  size = align8(size);
  if (self->nursery_current == NULL
      || self->nursery_current->used + size > self->nursery_current->capacity) {
    gc_nursery_alloc_block(self, size);
  }
  void *pointer = self->nursery_current->bytes + self->nursery_current->used;
  self->nursery_current->used += size;
  self->nursery_bytes += size;
  if (self->nursery_bytes > self->nursery_peak_bytes) {
    self->nursery_peak_bytes = self->nursery_bytes;
  }
  return pointer;
}

static void gc_nursery_reset(gc_t *self) {
  for (size_t i = 0; i < array_length(self->nursery_blocks); i++) {
    nursery_block_t *block = array_get(self->nursery_blocks, i);
    block->used = 0;
  }
  self->nursery_current = array_length(self->nursery_blocks) > 0
    ? array_get(self->nursery_blocks, 0)
    : NULL;
  self->nursery_bytes = 0;
}

static void gc_nursery_free(gc_t *self) {
  for (size_t i = 0; i < array_length(self->nursery_blocks); i++) {
    nursery_block_t *block = array_get(self->nursery_blocks, i);
    free(block->bytes);
    free(block);
  }
  array_free(self->nursery_blocks);
}

void *gc_new(size_t size) {
  gc_t *self = global_gc;
  object_t *object = gc_nursery_alloc(self, size);
  memory_clear(object, size);
  object->header.size = (uint32_t) size;
  object->header.generation = GC_YOUNG;
  object->header.mark = false;
  object->header.remembered = false;
  object->header.is_static = false;
  return object;
}

gc_t *make_gc(void) {
  gc_t *self = new(gc_t);
  self->old_objects = make_array();
  self->young_objects = make_array();
  self->young_resource_objects = make_array();
  self->remembered = make_array();
  self->work_stack = make_stack();
  self->nursery_blocks = make_array();
  self->nursery_current = NULL;
  self->nursery_bytes = 0;
  self->nursery_peak_bytes = 0;
  self->young_threshold = 4096;
  self->major_threshold = 4096;
  gc_stats_enabled = getenv("XVM_GC_STATS") != NULL;
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
  // - young objects live in the nursery: destroy inner buffers only.
  for (size_t i = 0; i < array_length(self->young_resource_objects); i++) {
    object_t *object = array_get(self->young_resource_objects, i);
    object->header.class->destroy_fn(object);
  }
  array_free(self->old_objects);
  array_free(self->young_objects);
  array_free(self->young_resource_objects);
  array_free(self->remembered);
  stack_free(self->work_stack);
  gc_nursery_free(self);
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
  array_push(self->young_objects, object);
  const object_class_t *class = object->header.class;
  if (class->destroy_fn) {
    array_push(self->young_resource_objects, object);
  }
  self->objects_allocated += 1;
  if (gc_stats_enabled) {
    gc_class_stats_t *stats = gc_class_stats_for(class);
    if (stats) stats->allocated += 1;
  }
}

void gc_remember(gc_t *self, object_t *object) {
  if (object->header.remembered) return;
  object->header.remembered = true;
  array_push(self->remembered, object);
  self->barrier_hits += 1;
}

// - copying nursery: forward young objects to the old generation.

value_t gc_forward(value_t value);

static object_t *gc_copy(gc_t *self, object_t *src) {
  const object_class_t *class = src->header.class;
  size_t size = src->header.size;

  object_t *dest = allocate(size);
  dest->header.class = class;
  dest->header.size = (uint32_t) size;
  dest->header.mark = false;
  dest->header.is_static = false;
  dest->header.generation = GC_OLD;
  dest->header.remembered = false;

  // - leave a forwarding pointer in the abandoned original.
  src->header.mark = true;
  src->header.class = (const object_class_t *) dest;

  if (gc_stats_enabled) {
    gc_class_stats_t *stats = gc_class_stats_for(class);
    if (stats) stats->promoted += 1;
    if (class->inner_bytes_fn) {
      size_t bytes = class->inner_bytes_fn(src);
      stats->inner_bytes_sum += bytes;
      if (bytes > stats->inner_bytes_max) stats->inner_bytes_max = bytes;
    }
  }

  class->copy_fn(dest, src, gc_forward);
  array_push(self->old_objects, dest);
  self->minor_promoted_objects += 1;
  self->copied_bytes += size;
  return dest;
}

value_t gc_forward(value_t value) {
  if ((value & TAG_MASK) != X_OBJECT) return value;
  object_t *object = (object_t *) (value & PAYLOAD_MASK);
  if (object->header.is_static) return value;
  if (object->header.generation != GC_YOUNG) return value;
  if (object->header.mark) {
    return x_object((void *) object->header.class);
  }
  return x_object(gc_copy(global_gc, object));
}

// - major marking: trace everything.

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

static void gc_mark_drain(gc_t *self) {
  while (!stack_is_empty(self->work_stack)) {
    object_t *object = stack_pop(self->work_stack);
    gc_mark_children(self, object, gc_mark_object);
  }
}

static void gc_check_visit(object_t *child, void *ctx) {
  (void) ctx;
  if (child->header.generation == GC_YOUNG) {
    who_printf("gc invariant violated: "
               "old -> young edge without write barrier\n");
    abort();
  }
}

// - debug: after evacuation, no old object may still point to a young object.
static void gc_check_invariant(gc_t *self) {
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
  array_clear(self->remembered);
}

// - evacuate young objects: copy survivors to old, reclaim the nursery.

static void gc_evacuate(gc_t *self, array_t *roots) {
  size_t young_before = array_length(self->young_objects);
  size_t old_before = array_length(self->old_objects);
  self->roots_scanned += array_length(roots);
  self->remembered_scanned += array_length(self->remembered);

  double t0 = now_s();
  for (size_t i = 0; i < array_length(roots); i++) {
    value_t *slot = array_get(roots, i);
    *slot = gc_forward(*slot);
  }
  for (size_t i = 0; i < array_length(self->remembered); i++) {
    object_t *object = array_get(self->remembered, i);
    const object_class_t *class = object->header.class;
    if (class->forward_fn) {
      class->forward_fn(object, gc_forward);
    }
  }
  self->minor_mark_time += now_s() - t0;

  t0 = now_s();
  // - dead resource objects: free inner buffers (forwarded ones already done
  //   by copy_fn).
  for (size_t i = 0; i < array_length(self->young_resource_objects); i++) {
    object_t *object = array_get(self->young_resource_objects, i);
    self->minor_resource_scanned += 1;
    if (!object->header.mark) {
      if (gc_stats_enabled) {
        gc_class_stats_t *stats = gc_class_stats_for(object->header.class);
        if (stats) stats->destroyed += 1;
        if (object->header.class->inner_bytes_fn) {
          size_t bytes = object->header.class->inner_bytes_fn(object);
          stats->inner_bytes_sum += bytes;
          if (bytes > stats->inner_bytes_max) stats->inner_bytes_max = bytes;
        }
      }
      object->header.class->destroy_fn(object);
      self->minor_resource_destroyed += 1;
    }
  }
  array_clear(self->young_resource_objects);
  array_clear(self->young_objects);
  gc_clear_remembered(self);
  gc_nursery_reset(self);
  self->minor_sweep_time += now_s() - t0;

  size_t survived = array_length(self->old_objects) - old_before;
  self->minor_freed_objects += young_before - survived;
  if (survived * 4 > young_before) {
    self->young_threshold *= 2;
    if (self->young_threshold > (size_t) (1 << 22)) {
      self->young_threshold = 1 << 22;
    }
  } else {
    self->young_threshold = survived * 4;
    if (self->young_threshold < 1024) {
      self->young_threshold = 1024;
    }
  }
}

static void gc_minor(gc_t *self, array_t *roots) {
  gc_evacuate(self, roots);
  gc_check_invariant(self);
  self->minor_count += 1;
}

static void gc_major(gc_t *self, array_t *roots) {
  size_t before = gc_object_count(self);

  // - evacuate young first, then mark-sweep the old generation.
  gc_evacuate(self, roots);
  gc_check_invariant(self);

  double t0 = now_s();
  for (size_t i = 0; i < array_length(roots); i++) {
    value_t *slot = array_get(roots, i);
    if (is_object(*slot)) {
      gc_mark_object(self, to_object(*slot));
    }
  }
  gc_mark_drain(self);
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
  array_free(self->old_objects);
  self->old_objects = new_old;
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
             "young_threshold=%zu major_threshold=%zu nursery_peak=%zu\n",
             self->objects_allocated, self->minor_count, self->major_count,
             array_length(self->old_objects),
             self->young_threshold, self->major_threshold,
             self->nursery_peak_bytes);
  who_printf("minor: copy=%.3fs reclaim=%.3fs promoted=%zu freed=%zu copied=%zuB\n",
             self->minor_mark_time, self->minor_sweep_time,
             self->minor_promoted_objects, self->minor_freed_objects,
             self->copied_bytes);
  who_printf("major: mark=%.3fs sweep=%.3fs marked=%zu freed=%zu\n",
             self->major_mark_time, self->major_sweep_time,
             self->major_marked_objects, self->major_freed_objects);
  who_printf("scan: roots=%zu remembered=%zu child_traversals=%zu "
             "children_visited=%zu barrier_hits=%zu nursery_blocks=%zu "
             "resource_scanned=%zu resource_destroyed=%zu\n",
             self->roots_scanned, self->remembered_scanned,
             self->child_traversals, self->children_visited,
             self->barrier_hits, self->nursery_blocks_allocated,
             self->minor_resource_scanned, self->minor_resource_destroyed);
  who_printf("barrier_calls=%zu\n", gc_barrier_calls);
  who_printf("classes:\n");
  for (size_t i = 0; i < gc_class_stats_count; i++) {
    gc_class_stats_t *s = &gc_class_stats[i];
    size_t n = s->promoted + s->destroyed;
    size_t avg = n > 0 ? s->inner_bytes_sum / n : 0;
    who_printf("  %-8s alloc=%zu promoted=%zu destroyed=%zu "
               "inner_avg=%zuB inner_max=%zuB\n",
               s->class->name ? s->class->name : "?",
               s->allocated, s->promoted, s->destroyed, avg, s->inner_bytes_max);
  }
}
