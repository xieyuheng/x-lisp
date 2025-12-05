#pragma once

list_t *make_string_list(void);
list_t *string_list_copy(list_t *list);

void string_list_print(list_t *list, const char *delimiter, file_t *file);
