#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include "types.h"

#define XEXE_NEXT_MAGIC   ((uint32_t) 0x5845584e)
#define XEXE_NEXT_VERSION ((uint32_t) 1)

#define XEXE_NEXT_RELOC_ABS64 0
#define XEXE_NEXT_RELOC_REL32 1

#define XEXE_NEXT_SYM_DEFINED  0
#define XEXE_NEXT_SYM_EXTERNAL 1

struct xexe_next_func_entry_t {
    uint32_t code_start;
    uint32_t code_end;
    uint32_t metadata_off;
};

struct xexe_next_reloc_t {
    uint32_t target_rva;
    uint32_t symbol_idx;
    uint8_t  reloc_type;
    uint8_t  reserved[3];
};

struct xexe_next_symbol_t {
    uint32_t name_off;
    uint32_t value_off;
    uint8_t  flags;
    uint8_t  reserved[3];
};

xexe_next_t *make_xexe_next(void);
void         xexe_next_free(xexe_next_t *self);

void  xexe_next_load(xexe_next_t *self, const char *pathname);
void  xexe_next_load_with_primitives(xexe_next_t *self, const char *pathname,
                                     size_t prim_count,
                                     const char **prim_names,
                                     void **prim_addrs);

// Returns a function pointer (blob_base + offset), or NULL if not found.
// The returned pointer is the entry point of the function (after the -8 slot).
void *xexe_next_lookup_function(xexe_next_t *self, const char *name);

// Given a return address (inside a native function), find the metadata pointer.
// Returns NULL if the address is not within any native function.
void *xexe_next_find_metadata(xexe_next_t *self, void *return_address);

// Returns the metadata pointer from the -8 slot of a native function.
void *xexe_next_get_function_metadata(xexe_next_t *self, void *func_ptr);

// Call the entry function.
void  xexe_next_call_entry(xexe_next_t *self, const char *entry_name);

// Access to internals for GC integration
uint8_t *xexe_next_blob_base(xexe_next_t *self);
size_t   xexe_next_blob_size(xexe_next_t *self);
