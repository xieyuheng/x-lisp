#pragma once

void tuple_init(tuple_t *self, size_t size);
tuple_t *tuple_new(size_t size, gc_t *gc);

size_t tuple_size(tuple_t *self);

bool tuple_is_atom_index(tuple_t *self, size_t index);
bool tuple_is_tuple_index(tuple_t *self, size_t index);

void tuple_set_tuple(tuple_t *self, size_t index, tuple_t *tuple);
void tuple_set_atom(tuple_t *self, size_t index, uint64_t atom);

tuple_t *tuple_get_tuple(tuple_t *self, size_t index);
uint64_t tuple_get_atom(tuple_t *self, size_t index);

bool tuple_is_forward(tuple_t *self);
tuple_t *tuple_get_forward(tuple_t *self);
void tuple_set_forward(tuple_t *self, tuple_t *tuple);

void tuple_print(tuple_t *self, file_t *file);
