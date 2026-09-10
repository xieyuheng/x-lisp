#pragma once

value_t x_object(void *target);
bool is_object(value_t value);
object_t *to_object(value_t value);
