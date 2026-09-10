#pragma once

value_t parse_json(const char *string);
void write_json(buffer_t *buffer, value_t json);
void write_string_escaped(buffer_t *buffer, const char *s);
void write_json_string_escaped(buffer_t *buffer, const char *s);
token_t *pop_token(list_t *tokens);
bool peek_is_token(list_t *tokens, token_kind_t kind, const char *content);

// constructors
value_t make_json_null(void);
value_t make_json_bool(bool b);
value_t make_json_number(double x);
value_t make_json_string(const char *s);
value_t make_json_array(void);
value_t make_json_object(void);
void json_array_push(value_t array, value_t element);
void json_object_put(value_t object, const char *key, value_t value);
