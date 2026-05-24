#pragma once

#include <stdbool.h>
#include <stdint.h>

typedef struct xexe_t xexe_t;

xexe_t *make_xexe(void);
void    xexe_free(xexe_t *self);

void   xexe_assemble(xexe_t *self, mod_t *mod);
void   xexe_write(xexe_t *self, const char *pathname);
void   xexe_load(xexe_t *self, const char *pathname);
mod_t *xexe_to_mod(xexe_t *self, bool profile);
