#pragma once

value_t parse_sexps(const path_t *path, const char *string);

// void sexp_print(const value_t sexp);

bool sexp_has_tag(value_t sexp, const char *tag);
