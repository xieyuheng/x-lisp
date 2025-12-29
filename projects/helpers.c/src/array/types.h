#pragma once

typedef int8_t ordering_t; 
typedef ordering_t (compare_fn_t)(const void *lhs, const void *rhs);

typedef struct array_t array_t;
