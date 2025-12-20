#pragma once

struct gc_t {
    array_t *allocated_objects;
    stack_t *gray_object_stack;
};
