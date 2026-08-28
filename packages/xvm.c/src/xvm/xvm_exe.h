#pragma once

#include <stdbool.h>
#include <stdint.h>

typedef struct xvm_exe_t xvm_exe_t;

xvm_exe_t *make_xvm_exe(void);
void       xvm_exe_free(xvm_exe_t *self);

void      xvm_exe_from_program(xvm_exe_t *self, program_t *program);
void      xvm_exe_dump(xvm_exe_t *self, const char *pathname);
void      xvm_exe_load(xvm_exe_t *self, const char *pathname);
program_t    *xvm_exe_to_program(xvm_exe_t *self);
