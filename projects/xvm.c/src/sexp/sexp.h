#pragma once

value_t parse_sexps(const char *string);
bool sexp_has_tag(value_t sexp, const char *tag);
void format_sexp(buffer_t *buffer, value_t sexp);
