#pragma once

value_t parse_sexps(const char *string);
// void print_sexp(const value_t sexp);
bool sexp_has_tag(value_t sexp, const char *tag);
