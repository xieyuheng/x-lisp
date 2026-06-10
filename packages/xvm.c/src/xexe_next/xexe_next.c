#include "index.h"

#include <fcntl.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>

struct xexe_next_t {
    uint8_t *blob_base;
    size_t   blob_size;
    uint8_t *code;
    uint8_t *data;
    struct xexe_next_func_entry_t *func_table;
    uint32_t  func_count;
    struct xexe_next_reloc_t      *reloc_table;
    uint32_t  reloc_count;
    struct xexe_next_symbol_t     *symbol_table;
    uint32_t  symbol_count;
    char     *string_table;
    uint32_t  string_size;
    void    **external_addrs;
    char    **external_names;
    size_t    external_count;
    uint8_t  *entry_func;
};

static uint32_t read_u32(const uint8_t *buf) {
    return (uint32_t) buf[0]
         | ((uint32_t) buf[1] << 8)
         | ((uint32_t) buf[2] << 16)
         | ((uint32_t) buf[3] << 24);
}

xexe_next_t *make_xexe_next(void) {
    xexe_next_t *self = new(xexe_next_t);
    return self;
}

void xexe_next_free(xexe_next_t *self) {
    if (self->blob_base) {
        munmap(self->blob_base, self->blob_size);
    }
    free(self->external_addrs);
    free(self->external_names);
    free(self);
}

static void parse_header(xexe_next_t *self, const uint8_t *buf) {
    uint32_t magic = read_u32(buf);
    if (magic != XEXE_NEXT_MAGIC) {
        who_printf("bad magic: 0x%x\n", magic);
        exit(1);
    }
    uint32_t version = read_u32(buf + 4);
    if (version != XEXE_NEXT_VERSION) {
        who_printf("unsupported version: %d\n", version);
        exit(1);
    }

    uint32_t code_size   = read_u32(buf + 12);
    uint32_t data_size   = read_u32(buf + 16);
    self->func_count     = read_u32(buf + 20);
    self->reloc_count    = read_u32(buf + 24);
    self->symbol_count   = read_u32(buf + 28);
    self->string_size    = read_u32(buf + 32);

    size_t func_table_off = 64;
    self->func_table = (xexe_next_func_entry_t *)(self->blob_base + func_table_off);

    size_t code_off = func_table_off + self->func_count * 12;
    self->code = self->blob_base + code_off;

    size_t data_off = code_off + code_size;
    self->data = self->blob_base + data_off;

    size_t reloc_off = data_off + data_size;
    self->reloc_table = (xexe_next_reloc_t *)(self->blob_base + reloc_off);

    size_t symbol_off = reloc_off + self->reloc_count * 12;
    self->symbol_table = (xexe_next_symbol_t *)(self->blob_base + symbol_off);

    size_t string_off = symbol_off + self->symbol_count * 12;
    self->string_table = (char *)(self->blob_base + string_off);
}

static void *find_external(xexe_next_t *self, const char *name) {
    for (size_t i = 0; i < self->external_count; i++) {
        if (string_equal(self->external_names[i], name)) {
            return self->external_addrs[i];
        }
    }
    return NULL;
}

static const char *symbol_name(xexe_next_t *self, uint32_t idx) {
    if (idx >= self->symbol_count) return NULL;
    uint32_t name_off = self->symbol_table[idx].name_off;
    return self->string_table + name_off;
}

static void apply_relocations(xexe_next_t *self) {
    for (uint32_t i = 0; i < self->reloc_count; i++) {
        xexe_next_reloc_t *r = &self->reloc_table[i];
        uint8_t *target = self->blob_base + r->target_rva;

        xexe_next_symbol_t *sym = &self->symbol_table[r->symbol_idx];
        const char *name = self->string_table + sym->name_off;

        void *symbol_addr = NULL;
        if (sym->flags == XEXE_NEXT_SYM_DEFINED) {
            symbol_addr = self->blob_base + sym->value_off;
        } else {
            symbol_addr = find_external(self, name);
            if (!symbol_addr) {
                who_printf("warning: unresolved external symbol: %s\n", name);
                continue;
            }
        }

        if (r->reloc_type == XEXE_NEXT_RELOC_ABS64) {
            uint64_t val = (uint64_t)(uintptr_t) symbol_addr;
            memcpy(target, &val, sizeof(val));
        } else if (r->reloc_type == XEXE_NEXT_RELOC_REL32) {
            int64_t rel = (int64_t)((uint8_t *)symbol_addr - (target + 4));
            int32_t rel32 = (int32_t) rel;
            if ((int64_t) rel32 != rel) {
                who_printf("rel32 overflow for symbol: %s\n", name);
                exit(1);
            }
            memcpy(target, &rel32, sizeof(rel32));
        }
    }
}

void xexe_next_load(xexe_next_t *self, const char *pathname) {
    xexe_next_load_with_primitives(self, pathname, 0, NULL, NULL);
}

void xexe_next_load_with_primitives(xexe_next_t *self, const char *pathname,
                                     size_t prim_count,
                                     const char **prim_names,
                                     void **prim_addrs) {
    self->external_count = prim_count;
    self->external_names = (char **)allocate_pointers(prim_count);
    self->external_addrs = (void **)allocate_pointers(prim_count);
    for (size_t i = 0; i < prim_count; i++) {
        self->external_names[i] = (char *)prim_names[i];
        self->external_addrs[i] = prim_addrs[i];
    }

    int fd = open(pathname, O_RDONLY);
    if (fd < 0) {
        who_printf("cannot open: %s\n", pathname);
        exit(1);
    }

    struct stat st;
    fstat(fd, &st);
    self->blob_size = (size_t) st.st_size;

    self->blob_base = (uint8_t *) mmap(NULL, self->blob_size,
        PROT_READ | PROT_WRITE | PROT_EXEC, MAP_PRIVATE, fd, 0);
    close(fd);

    if (self->blob_base == MAP_FAILED) {
        who_printf("mmap failed\n");
        exit(1);
    }

    parse_header(self, self->blob_base);
    apply_relocations(self);
}

void *xexe_next_lookup_function(xexe_next_t *self, const char *name) {
    for (uint32_t i = 0; i < self->symbol_count; i++) {
        const char *sym_name = symbol_name(self, i);
        if (sym_name && string_equal(sym_name, name)) {
            if (self->symbol_table[i].flags == XEXE_NEXT_SYM_DEFINED) {
                uint32_t off = self->symbol_table[i].value_off;
                return self->blob_base + off;
            }
        }
    }
    return NULL;
}

void *xexe_next_find_metadata(xexe_next_t *self, void *return_address) {
    if (!self->func_table || self->func_count == 0) return NULL;

    uint8_t *addr = (uint8_t *) return_address;
    if (addr < self->blob_base || addr >= self->blob_base + self->blob_size) {
        return NULL;
    }

    uint32_t rva = (uint32_t)(addr - self->blob_base);

    int32_t lo = 0;
    int32_t hi = (int32_t) self->func_count - 1;

    while (lo <= hi) {
        int32_t mid = lo + (hi - lo) / 2;
        uint32_t start = self->func_table[mid].code_start;
        uint32_t end = self->func_table[mid].code_end;

        if (rva >= start && rva < end) {
            uint32_t meta_off = self->func_table[mid].metadata_off;
            if (meta_off == 0) return NULL;
            return self->blob_base + meta_off;
        }

        if (rva < start) {
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }

    return NULL;
}

void *xexe_next_get_function_metadata(xexe_next_t *self, void *func_ptr) {
    uint8_t *ptr = (uint8_t *) func_ptr;
    if (ptr < self->blob_base || ptr >= self->blob_base + self->blob_size) {
        return NULL;
    }

    uint64_t meta_addr;
    memcpy(&meta_addr, ptr - 8, sizeof(meta_addr));
    if (meta_addr == 0) return NULL;
    return (void *)(uintptr_t) meta_addr;
}

void xexe_next_call_entry(xexe_next_t *self, const char *entry_name) {
    void *func = xexe_next_lookup_function(self, entry_name);
    if (!func) {
        who_printf("entry function not found: %s\n", entry_name);
        exit(1);
    }

    typedef void (*native_func_t)(void);
    native_func_t entry;
    memcpy(&entry, &func, sizeof(func));
    entry();
}

uint8_t *xexe_next_blob_base(xexe_next_t *self) {
    return self->blob_base;
}

size_t xexe_next_blob_size(xexe_next_t *self) {
    return self->blob_size;
}
