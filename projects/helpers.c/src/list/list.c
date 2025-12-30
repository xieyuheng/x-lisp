#include "index.h"

struct list_t {
    list_node_t *first_node;
    list_node_t *last_node;
    size_t length;
    free_fn_t *free_fn;
    equal_fn_t *equal_fn;
    copy_fn_t *copy_fn;
};

list_t *
make_list(void) {
    list_t *self = new(list_t);
    return self;
}

void
list_free(list_t *self) {
    list_purge(self);
    free(self);
}

void
list_purge(list_t *self) {
    assert(self);

    list_node_t *node = self->first_node;
    while (node) {
        list_node_t *next = node->next;
        if (self->free_fn)
            self->free_fn(node->value);
        list_node_free(node);
        node = next;
    }

    self->first_node = NULL;
    self->last_node = NULL;
    self->length = 0;
}

void
list_put_free_fn(list_t *self, free_fn_t *free_fn) {
    self->free_fn = free_fn;
}

void
list_put_equal_fn(list_t *self, equal_fn_t *equal_fn) {
    self->equal_fn = equal_fn;
}

void
list_put_copy_fn(list_t *self, copy_fn_t *copy_fn) {
    self->copy_fn = copy_fn;
}

list_t *
make_list_with(free_fn_t *free_fn) {
    list_t *self = make_list();
    self->free_fn = free_fn;
    return self;
}

list_t *
list_copy(list_t *self) {
    assert(self);

    list_t *list = make_list();
    list->equal_fn = self->equal_fn;

    list_node_t *node = self->first_node;
    while (node) {
        if (self->copy_fn) {
            list_push(list, self->copy_fn(node->value));
        } else {
            list_push(list, node->value);
        }

        node = node->next;
    }

    return list;
}

list_t *
list_copy_reversed(list_t *self) {
    assert(self);

    list_t *list = make_list();
    list->equal_fn = self->equal_fn;

    list_node_t *node = self->first_node;
    while (node) {
        if (self->copy_fn) {
            list_unshift(list, self->copy_fn(node->value));
        } else {
            list_unshift(list, node->value);
        }

        node = node->next;
    }

    return list;
}

size_t
list_length(const list_t *self) {
    return self->length;
}

bool
list_is_empty(const list_t *self) {
    return self->length == 0;
}

bool
list_member(const list_t *self, const void *value) {
    assert(self);
    list_node_t *node = self->first_node;
    while (node) {
        if ((node->value == value) ||
            (self->equal_fn && self->equal_fn(node->value, value)))
            return true;

        node = node->next;
    }

    return false;
}

bool
list_remove(list_t *self, const void *value) {
    list_node_t *node = self->first_node;

    while (node != NULL) {
        if ((node->value == value) ||
            (self->equal_fn && self->equal_fn(node->value, value)))
            break;
        node = node->next;
    }

    if (!node) return false;

    if (node->next)
        node->next->prev = node->prev;
    if (node->prev)
        node->prev->next = node->next;

    if (self->first_node == node)
        self->first_node = node->next;
    if (self->last_node == node)
        self->last_node = node->prev;

    if (self->free_fn)
        self->free_fn(node->value);

    list_node_free(node);
    self->length--;
    return true;
}

void *
list_find(list_t *self, const void *value) {
    assert(self);

    list_node_t *node = self->first_node;
    while (node) {
        if ((node->value == value) ||
            (self->equal_fn && self->equal_fn(node->value, value)))
        {
            return node->value;
        }

        node = node->next;
    }

    return NULL;
}

const list_node_t *
list_first_node(const list_t *self) {
    return self->first_node;
}

const list_node_t *
list_last_node(const list_t *self) {
    return self->last_node;
}

void *
list_first(const list_t *self) {
    assert(self);
    if (self->first_node) {
        return self->first_node->value;
    } else {
        return NULL;
    }
}

void *
list_last(const list_t *self) {
    assert(self);
    if (self->last_node) {
        return self->last_node->value;
    } else {
        return NULL;
    }
}

void
list_push(list_t *self, void *value) {
    list_node_t *node = make_list_node(value);
    if (self->last_node) {
        self->last_node->next = node;
        node->prev = self->last_node;
        node->next = NULL;
    } else {
        self->first_node = node;
        node->prev = NULL;
        node->next = NULL;
    }

    self->last_node = node;
    self->length++;
}

void *
list_pop(list_t *self) {
    list_node_t *node = self->last_node;
    if (!node) return NULL;

    if (self->first_node == node)
        self->first_node = NULL;

    void *value = node->value;

    if (node->prev) {
        self->last_node = node->prev;
        self->last_node->next = NULL;
    } else {
        self->last_node = NULL;
    }

    list_node_free(node);
    self->length--;

    return value;
}

void
list_unshift(list_t *self, void *value) {
    list_node_t *node = make_list_node(value);
    if (self->first_node) {
        self->first_node->prev = node;
        node->next = self->first_node;
        node->prev = NULL;
    } else {
        self->last_node = node;
        node->next = NULL;
        node->prev = NULL;
    }

    self->first_node = node;
    self->length++;
}

void *
list_shift(list_t *self) {
    list_node_t *node = self->first_node;
    if (!node) return NULL;

    if (self->last_node == node)
        self->last_node = NULL;

    void *value = node->value;

    if (node->next) {
        self->first_node = node->next;
        self->first_node->prev = NULL;
    } else {
        self->first_node = NULL;
    }

    list_node_free(node);
    self->length--;

    return value;
}

void *
list_get(const list_t *self, size_t index) {
    list_node_t *node = self->first_node;
    while (node) {
        if (index == 0) return node->value;
        node = node->next;
        index--;
    }

    return NULL;
}

list_t *
list_from_array(const array_t *array) {
    list_t *list = make_list();
    for (size_t i = 0; i < array_length(array); i++) {
        list_push(list, array_get(array, i));
    }

    return list;
}
