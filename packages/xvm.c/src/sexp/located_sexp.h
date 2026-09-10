#pragma once

void ignore_line_comments(list_t *tokens);
value_t parse_located_sexps(const char *pathname, const char *string);
