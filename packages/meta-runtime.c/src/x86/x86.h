#pragma once

void *x86_execute_exe(const buffer_t *buffer);
void *x86_execute_exe_with_xvm(xvm_t *xvm, const buffer_t *buffer);

typedef struct x86_image_t x86_image_t;

x86_image_t *x86_load_image(xvm_t *xvm, const buffer_t *buffer);
void *x86_call_native_entry(x86_image_t *image, const char *name, uint8_t argc, value_t *args);
void *x86_call_entry(x86_image_t *image);
void x86_unload_image(x86_image_t *image, xvm_t *xvm);
array_t *x86_collect_tests(x86_image_t *image);
