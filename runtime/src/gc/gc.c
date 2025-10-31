#include "index.h"

struct gc_t {
    void **root_space; size_t root_size;
    void **root_pointer;
    void **from_space; size_t from_size;
    void **to_space; size_t to_size;
    void **free_pointer;
    void **scan_pointer;
    bool log_flag;
};

gc_t *
gc_new(size_t root_size, size_t heap_size) {
    assert(root_size > 0);
    assert(heap_size > 0);
    gc_t *self = new(gc_t);
    self->root_space = allocate_pointers(root_size);
    self->root_size = root_size;
    self->root_pointer = self->root_space;
    self->from_space = allocate_pointers(heap_size);
    self->from_size = heap_size;
    self->to_space = allocate_pointers(heap_size);
    self->to_size = heap_size;
    self->free_pointer = self->from_space;
    self->scan_pointer = self->to_space;
    self->log_flag = false;
    return self;
}

void
gc_set_log_flag(gc_t* self, bool flag) {
    self->log_flag = flag;
}

void
gc_expose_root_space(gc_t* self, void ***root_space_pointer) {
    *root_space_pointer = self->root_space;
}

void
gc_set_root_pointer(gc_t* self, void **root_pointer) {
    self->root_pointer = root_pointer;
}

size_t
gc_root_length(gc_t* self) {
    return self->root_pointer - self->root_space;
}

void
gc_push_root(gc_t* self, tuple_t *tuple) {
    assert(gc_root_length(self) < self->root_size);
    *self->root_pointer = tuple;
    self->root_pointer++;
}

tuple_t *
gc_pop_root(gc_t* self) {
    assert(gc_root_length(self) > 0);
    self->root_pointer--;
    return *self->root_pointer;
}

static bool
gc_space_is_enough(gc_t* self, size_t size) {
    return self->free_pointer + size + 1 < self->from_space + self->from_size;
}

static void gc_copy(gc_t* self);

tuple_t *
gc_allocate_tuple(gc_t* self, size_t size) {
    if (gc_space_is_enough(self, size)) {
        tuple_t *tuple = self->free_pointer;
        tuple_init(tuple, size);
        self->free_pointer += size + 1; // + 1 for header

        if (self->log_flag) {
            who_printf("allocated %ld * 8 bytes\n", size + 1);
        }

        return tuple;
    }

    if (self->log_flag) {
        who_printf("need copy\n");
    }

    gc_copy(self);

    if (!gc_space_is_enough(self, size)) {
        if (self->log_flag) {
            who_printf("need grow\n");
        }

        gc_grow(self);
    }

    return gc_allocate_tuple(self, size);
}

static bool
in_from_space(gc_t* self, tuple_t *tuple) {
    return ((self->from_space <= tuple) &&
            (tuple < self->from_space + self->from_size));
}

static bool
in_to_space(gc_t* self, tuple_t *tuple) {
    return ((self->to_space <= tuple) &&
            (tuple < self->to_space + self->to_size));
}

static tuple_t *
gc_copy_tuple(gc_t* self, tuple_t *tuple) {
    assert(in_from_space(self, tuple));
    assert(in_to_space(self, self->free_pointer));

    if (tuple_is_forward(tuple)) {
        return tuple_get_forward(tuple);
    }

    tuple_t *new_tuple = self->free_pointer;
    self->free_pointer += tuple_size(tuple) + 1; // + 1 for header
    for (size_t i = 0; i < tuple_size(tuple) + 1; i++) {
        new_tuple[i] = tuple[i];
    }

    tuple_set_forward(tuple, new_tuple);
    return new_tuple;
}

static void
gc_copy(gc_t* self) {
    if (self->log_flag) {
        who_printf("prepare the to-space to use it as a queue\n");
    }

    self->scan_pointer = self->to_space;
    self->free_pointer = self->to_space;
    size_t root_length = self->root_pointer - self->root_space;
    for (size_t i = 0; i < root_length; i++) {
        tuple_t *tuple = self->root_space[i];
        self->root_space[i] = gc_copy_tuple(self, tuple);
    }

    if (self->log_flag) {
        who_printf("use to-space as a queue to traverse the graph and copy\n");
    }

    while (self->scan_pointer <= self->free_pointer) {
        tuple_t *tuple = self->scan_pointer;
        self->scan_pointer += tuple_size(tuple) + 1; // + 1 for header
        for (size_t i = 0; i < tuple_size(tuple); i++) {
            if (tuple_is_tuple_index(tuple, i)) {
                tuple_t *child = tuple_get_tuple(tuple, i);
                tuple_set_tuple(tuple, i, gc_copy_tuple(self, child));
            }
        }
    }

    if (self->log_flag) {
        who_printf("swap the role of to-space with from-space\n");
    }

    void **tmp_space = self->to_space;
    self->to_space = self->from_space;
    self->from_space = tmp_space;
    size_t tmp_size = self->to_size;
    self->to_size = self->from_size;
    self->from_size = tmp_size;
}

static void
gc_grow_to_space(gc_t* self) {
    if (self->log_flag) {
        who_printf("grow %ld -> %ld\n", self->to_size, self->to_size * 2);
    }

    self->to_space =
        reallocate_pointers(self->to_space, self->to_size, self->to_size * 2);
    self->to_size *= 2;
}

void
gc_grow(gc_t* self) {
    gc_grow_to_space(self);
    gc_copy(self);
    gc_grow_to_space(self);
}

void
gc_print(gc_t* self) {
    assert(in_from_space(self, self->free_pointer));

    printf("from_size: %ld\n", self->from_size);
    printf("used_size: %ld\n", self->free_pointer - self->from_space);

    printf("root_space:\n");
    size_t root_length = self->root_pointer - self->root_space;
    for (size_t i = 0; i < root_length; i++) {
        printf("  %ld (%p): ", i, self->root_space[i]);
        tuple_print(self->root_space[i], stdout);
        printf("\n");
    }

    printf("from_space:\n");
    size_t count = 0;
    tuple_t *tuple = self->from_space;
    while (tuple < self->free_pointer) {
        printf("  %ld (%p): ", count, (void *) tuple);
        tuple_print(tuple, stdout);
        printf("\n");
        tuple += tuple_size(tuple) + 1;
        count++;
    }
}
