#pragma once

bool pointer_is_8_bytes_aligned(void *pointer);

// clear memory to zero
void *allocate(size_t size);
void *allocate_pointers(size_t size);

// clear new memory to zero
void *reallocate(void *pointer, size_t old_size, size_t new_size);
void *reallocate_pointers(void *pointer, size_t old_size, size_t new_size);

bool pointer_is_page_aligned(void *pointer);

// aligned to page to avoid false sharing
void *allocate_page_aligned(size_t size);

void memory_clear(void *pointer, size_t size);

void memory_copy(void* dest, const void* src, size_t n);
void memory_copy_reverse(void* dest, const void* src, size_t n);

bool memory_is_little_endian(void);

void memory_copy_little_endian(void* dest, const void* src, size_t n);
void memory_copy_big_endian(void* dest, const void* src, size_t n);

#define memory_store_little_endian(dest, x) \
    memory_copy_little_endian(dest, &x, sizeof x)
#define memory_store_big_endian(dest, x) \
    memory_copy_big_endian(dest, &x, sizeof x)

#define memory_load_little_endian(dest, x) \
    memory_copy_little_endian(&x, dest, sizeof x)
#define memory_load_big_endian(dest, x) \
    memory_copy_big_endian(&x, dest, sizeof x)
