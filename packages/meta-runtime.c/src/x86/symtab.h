#pragma once

void x86_symtab_init(void);
void x86_symtab_register(const char *name, void *addr);
void *x86_symtab_lookup(const char *name);
void x86_symtab_populate_from_mod(mod_t *mod);
void x86_symtab_free(void);
