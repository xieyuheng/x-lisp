#pragma once

value_t parse_sexps(const char *string);
void write_as_sexp(buffer_t *buffer, value_t sexp);
