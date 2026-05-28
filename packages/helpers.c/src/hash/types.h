#pragma once

typedef uint32_t hash_code_t;
typedef hash_code_t (hash_fn_t)(const void *key);

typedef struct hash_t hash_t;
typedef struct hash_entry_t hash_entry_t;
typedef struct hash_iter_t hash_iter_t;
