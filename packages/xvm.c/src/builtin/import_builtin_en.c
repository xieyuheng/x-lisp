#include "index.h"

void import_builtin_en(mod_t *mod) {
  // int

  define_primitive_1(mod, "meta-builtin/builtin/is-int", x_is_int);
  define_primitive_1(mod, "meta-builtin/builtin/ineg", x_ineg);
  define_primitive_2(mod, "meta-builtin/builtin/iadd", x_iadd);
  define_primitive_2(mod, "meta-builtin/builtin/isub", x_isub);
  define_primitive_2(mod, "meta-builtin/builtin/imul", x_imul);
  define_primitive_2(mod, "meta-builtin/builtin/idiv", x_idiv);
  define_primitive_2(mod, "meta-builtin/builtin/imod", x_imod);
  define_primitive_2(mod, "meta-builtin/builtin/int-max", x_int_max);
  define_primitive_2(mod, "meta-builtin/builtin/int-min", x_int_min);
  define_primitive_2(mod, "meta-builtin/builtin/int-greater", x_int_greater);
  define_primitive_2(mod, "meta-builtin/builtin/int-less", x_int_less);
  define_primitive_2(mod, "meta-builtin/builtin/int-greater-or-equal", x_int_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/int-less-or-equal", x_int_less_or_equal);
  define_primitive_1(mod, "meta-builtin/builtin/int-is-positive", x_int_positive);
  define_primitive_1(mod, "meta-builtin/builtin/int-is-non-negative", x_int_non_negative);
  define_primitive_1(mod, "meta-builtin/builtin/int-is-non-zero", x_int_non_zero);
  define_primitive_2(mod, "meta-builtin/builtin/int-compare-ascending", x_int_compare_ascending);
  define_primitive_2(mod, "meta-builtin/builtin/int-compare-descending", x_int_compare_descending);
  define_primitive_1(mod, "meta-builtin/builtin/int-to-float", x_int_to_float);

  // float

  define_primitive_1(mod, "meta-builtin/builtin/is-float", x_is_float);
  define_primitive_1(mod, "meta-builtin/builtin/fneg", x_fneg);
  define_primitive_2(mod, "meta-builtin/builtin/fadd", x_fadd);
  define_primitive_2(mod, "meta-builtin/builtin/fsub", x_fsub);
  define_primitive_2(mod, "meta-builtin/builtin/fmul", x_fmul);
  define_primitive_2(mod, "meta-builtin/builtin/fdiv", x_fdiv);
  define_primitive_2(mod, "meta-builtin/builtin/fmod", x_fmod);
  define_primitive_2(mod, "meta-builtin/builtin/float-max", x_float_max);
  define_primitive_2(mod, "meta-builtin/builtin/float-min", x_float_min);
  define_primitive_2(mod, "meta-builtin/builtin/float-greater", x_float_greater);
  define_primitive_2(mod, "meta-builtin/builtin/float-less", x_float_less);
  define_primitive_2(mod, "meta-builtin/builtin/float-greater-or-equal", x_float_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/float-less-or-equal", x_float_less_or_equal);
  define_primitive_1(mod, "meta-builtin/builtin/float-is-positive", x_float_positive);
  define_primitive_1(mod, "meta-builtin/builtin/float-is-non-negative", x_float_non_negative);
  define_primitive_1(mod, "meta-builtin/builtin/float-is-non-zero", x_float_non_zero);
  define_primitive_2(mod, "meta-builtin/builtin/float-compare-ascending", x_float_compare_ascending);
  define_primitive_2(mod, "meta-builtin/builtin/float-compare-descending", x_float_compare_descending);
  define_primitive_1(mod, "meta-builtin/builtin/float-to-int", x_float_to_int);

  // bool

  define_variable(mod, "meta-builtin/builtin/true", x_true);
  define_variable(mod, "meta-builtin/builtin/false", x_false);
  define_primitive_1(mod, "meta-builtin/builtin/is-bool", x_is_bool);
  define_primitive_1(mod, "meta-builtin/builtin/not", x_not);

  // void

  define_variable(mod, "meta-builtin/builtin/void", x_void);
  define_primitive_1(mod, "meta-builtin/builtin/is-void", x_is_void);

  // type

  define_variable_primitive_0(mod, "meta-builtin/builtin/type-t", x_type_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/any-t", x_any_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/int-t", x_int_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/float-t", x_float_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/string-t", x_string_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/symbol-t", x_symbol_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/keyword-t", x_keyword_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/bool-t", x_bool_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/void-t", x_void_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/file-t", x_file_t);
  define_primitive_1(mod, "meta-builtin/builtin/list-t", x_list_t);
  define_primitive_1(mod, "meta-builtin/builtin/set-t", x_set_t);
  define_primitive_2(mod, "meta-builtin/builtin/hash-t", x_hash_t);
  define_primitive_2(mod, "meta-builtin/builtin/pair-t", x_pair_t);

  // value

  define_primitive_1(mod, "meta-builtin/builtin/is-atom", x_is_atom);
  define_primitive_2(mod, "meta-builtin/builtin/same", x_same);
  define_primitive_2(mod, "meta-builtin/builtin/equal", x_equal);
  define_primitive_1(mod, "meta-builtin/builtin/format", x_format);
  define_primitive_1(mod, "meta-builtin/builtin/hash-code", x_hash_code);
  define_primitive_2(mod, "meta-builtin/builtin/total-compare", x_total_compare);

  // file

  define_primitive_1(mod, "meta-builtin/builtin/open-input-file", x_open_input_file);
  define_primitive_1(mod, "meta-builtin/builtin/open-output-file", x_open_output_file);
  define_primitive_1(mod, "meta-builtin/builtin/file-close", x_file_close);
  define_primitive_1(mod, "meta-builtin/builtin/file-read", x_file_read);
  define_primitive_2(mod, "meta-builtin/builtin/file-write", x_file_write);
  define_primitive_2(mod, "meta-builtin/builtin/file-writeln", x_file_writeln);
  define_primitive_1(mod, "meta-builtin/builtin/print", x_print);
  define_primitive_1(mod, "meta-builtin/builtin/println", x_println);

  // path

  define_primitive_1(mod, "meta-builtin/builtin/path-file-name", x_path_file_name);
  define_primitive_1(mod, "meta-builtin/builtin/path-directory-name", x_path_directory_name);
  define_primitive_1(mod, "meta-builtin/builtin/path-extension", x_path_extension);
  define_primitive_1(mod, "meta-builtin/builtin/path-stem", x_path_stem);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-absolute", x_path_is_absolute);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-relative", x_path_is_relative);
  define_primitive_2(mod, "meta-builtin/builtin/path-join", x_path_join);
  define_primitive_1(mod, "meta-builtin/builtin/path-normalize", x_path_normalize);
  define_primitive_2(mod, "meta-builtin/builtin/path-relative", x_path_relative);
  define_primitive_1(mod, "meta-builtin/builtin/path-relative-to-cwd", x_path_relative_to_cwd);
  define_primitive_1(mod, "meta-builtin/builtin/path-resolve", x_path_resolve);

  // random

  define_primitive_2(mod, "meta-builtin/builtin/random-int", x_random_int);
  define_primitive_2(mod, "meta-builtin/builtin/random-float", x_random_float);

  // keyword

  define_primitive_1(mod, "meta-builtin/builtin/is-keyword", x_is_keyword);
  define_primitive_1(mod, "meta-builtin/builtin/keyword-length", x_keyword_length);
  define_primitive_1(mod, "meta-builtin/builtin/keyword-to-string", x_keyword_to_string);
  define_primitive_2(mod, "meta-builtin/builtin/keyword-append", x_keyword_append);
  define_primitive_1(mod, "meta-builtin/builtin/keyword-concat", x_keyword_concat);

  // symbol

  define_primitive_1(mod, "meta-builtin/builtin/is-symbol", x_is_symbol);
  define_primitive_1(mod, "meta-builtin/builtin/symbol-length", x_symbol_length);
  define_primitive_1(mod, "meta-builtin/builtin/symbol-to-string", x_symbol_to_string);
  define_primitive_2(mod, "meta-builtin/builtin/symbol-append", x_symbol_append);
  define_primitive_1(mod, "meta-builtin/builtin/symbol-concat", x_symbol_concat);

  // string

  define_primitive_1(mod, "meta-builtin/builtin/is-string", x_is_string);
  define_primitive_1(mod, "meta-builtin/builtin/string-length", x_string_length);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-empty", x_string_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-blank", x_string_is_blank);
  define_primitive_3(mod, "meta-builtin/builtin/string-substring", x_string_substring);
  define_primitive_2(mod, "meta-builtin/builtin/string-append", x_string_append);
  define_primitive_1(mod, "meta-builtin/builtin/string-concat", x_string_concat);
  define_primitive_2(mod, "meta-builtin/builtin/string-compare-lexical", x_string_compare_lexical);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-symbol", x_string_to_symbol);
  define_primitive_1(mod, "meta-builtin/builtin/string-chars", x_string_chars);
  define_primitive_1(mod, "meta-builtin/builtin/string-lines", x_string_lines);
  define_primitive_2(mod, "meta-builtin/builtin/string-split", x_string_split);
  define_primitive_2(mod, "meta-builtin/builtin/string-join", x_string_join);
  define_primitive_3(mod, "meta-builtin/builtin/string-replace", x_string_replace);
  define_primitive_2(mod, "meta-builtin/builtin/string-starts-with", x_string_starts_with);
  define_primitive_2(mod, "meta-builtin/builtin/string-ends-with", x_string_ends_with);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-upper-case", x_string_to_upper_case);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-lower-case", x_string_to_lower_case);
  define_primitive_2(mod, "meta-builtin/builtin/string-get-code-point", x_string_get_code_point);
  define_primitive_2(mod, "meta-builtin/builtin/string-contains", x_string_contains);
  define_primitive_2(mod, "meta-builtin/builtin/string-find-index", x_string_find_index);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-left", x_string_trim_left);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-right", x_string_trim_right);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-start", x_string_trim_start);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-end", x_string_trim_end);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim", x_string_trim);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-int", x_string_is_int);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-float", x_string_is_float);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-int", x_string_to_int);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-float", x_string_to_float);

  // list

  define_primitive_0(mod, "meta-builtin/builtin/make-list", x_make_list);
  define_primitive_1(mod, "meta-builtin/builtin/is-list", x_is_any_list);
  define_primitive_1(mod, "meta-builtin/builtin/list-copy", x_list_copy);
  define_primitive_1(mod, "meta-builtin/builtin/list-length", x_list_length);
  define_primitive_1(mod, "meta-builtin/builtin/list-is-empty", x_list_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/list-pop", x_list_pop_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-push", x_list_push_mut);
  define_primitive_1(mod, "meta-builtin/builtin/list-pop-front", x_list_pop_front_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-push-front", x_list_push_front_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-get", x_list_get);
  define_primitive_3(mod, "meta-builtin/builtin/list-put", x_list_put_mut);
  define_primitive_3(mod, "meta-builtin/builtin/list-copy-put", x_list_put);
  define_primitive_1(mod, "meta-builtin/builtin/car", x_car);
  define_primitive_1(mod, "meta-builtin/builtin/cdr", x_cdr);
  define_primitive_2(mod, "meta-builtin/builtin/cons", x_cons);
  define_primitive_1(mod, "meta-builtin/builtin/list-head", x_list_head);
  define_primitive_1(mod, "meta-builtin/builtin/list-rest", x_list_rest);
  define_primitive_1(mod, "meta-builtin/builtin/list-but-last", x_list_but_last);
  define_primitive_1(mod, "meta-builtin/builtin/list-last", x_list_last);
  define_primitive_1(mod, "meta-builtin/builtin/list-reverse", x_list_reverse_mut);
  define_primitive_1(mod, "meta-builtin/builtin/list-copy-reverse", x_list_reverse);
  define_primitive_1(mod, "meta-builtin/builtin/list-to-set", x_list_to_set);

  // pair

  define_primitive_2(mod, "meta-builtin/builtin/make-pair", x_make_pair);
  define_primitive_1(mod, "meta-builtin/builtin/pair-first", x_pair_first);
  define_primitive_1(mod, "meta-builtin/builtin/pair-second", x_pair_second);
  define_primitive_2(mod, "meta-builtin/builtin/pair-put-first", x_pair_put_first);
  define_primitive_2(mod, "meta-builtin/builtin/pair-put-second", x_pair_put_second);

  // hash

  define_primitive_0(mod, "meta-builtin/builtin/make-hash", x_make_hash);
  define_primitive_1(mod, "meta-builtin/builtin/is-hash", x_is_any_hash);
  define_primitive_1(mod, "meta-builtin/builtin/hash-copy", x_hash_copy);
  define_primitive_1(mod, "meta-builtin/builtin/hash-length", x_hash_length);
  define_primitive_1(mod, "meta-builtin/builtin/hash-is-empty", x_hash_is_empty);
  define_primitive_2(mod, "meta-builtin/builtin/hash-get", x_hash_get);
  define_primitive_2(mod, "meta-builtin/builtin/hash-has", x_hash_has);
  define_primitive_3(mod, "meta-builtin/builtin/hash-put", x_hash_put_mut);
  define_primitive_3(mod, "meta-builtin/builtin/hash-copy-put", x_hash_put);
  define_primitive_2(mod, "meta-builtin/builtin/hash-delete", x_hash_delete_mut);
  define_primitive_1(mod, "meta-builtin/builtin/hash-keys", x_hash_keys);
  define_primitive_1(mod, "meta-builtin/builtin/hash-values", x_hash_values);
  define_primitive_1(mod, "meta-builtin/builtin/hash-entries", x_hash_entries);

  // set

  define_primitive_0(mod, "meta-builtin/builtin/make-set", x_make_set);
  define_primitive_1(mod, "meta-builtin/builtin/is-set", x_is_any_set);
  define_primitive_1(mod, "meta-builtin/builtin/set-copy", x_set_copy);
  define_primitive_1(mod, "meta-builtin/builtin/set-size", x_set_size);
  define_primitive_1(mod, "meta-builtin/builtin/set-is-empty", x_set_is_empty);
  define_primitive_2(mod, "meta-builtin/builtin/set-member", x_set_member);
  define_primitive_2(mod, "meta-builtin/builtin/set-add", x_set_add_mut);
  define_primitive_2(mod, "meta-builtin/builtin/set-copy-add", x_set_add);
  define_primitive_2(mod, "meta-builtin/builtin/set-delete", x_set_delete_mut);
  define_primitive_2(mod, "meta-builtin/builtin/set-copy-delete", x_set_delete);
  define_primitive_1(mod, "meta-builtin/builtin/set-clear", x_set_clear_mut);
  define_primitive_2(mod, "meta-builtin/builtin/set-union", x_set_union);
  define_primitive_2(mod, "meta-builtin/builtin/set-inter", x_set_inter);
  define_primitive_2(mod, "meta-builtin/builtin/set-difference", x_set_difference);
  define_primitive_2(mod, "meta-builtin/builtin/set-subset", x_set_subset);
  define_primitive_2(mod, "meta-builtin/builtin/set-disjoint", x_set_disjoint);
  define_primitive_1(mod, "meta-builtin/builtin/set-to-list", x_set_to_list);

  // assert

  define_primitive_1(mod, "meta-builtin/builtin/assert", x_assert);
  define_primitive_1(mod, "meta-builtin/builtin/assert-not", x_assert_not);
  define_primitive_2(mod, "meta-builtin/builtin/assert-equal", x_assert_equal);
  define_primitive_2(mod, "meta-builtin/builtin/assert-not-equal", x_assert_not_equal);
  define_primitive_2(mod, "meta-builtin/builtin/assert-with-location", x_assert_with_location);
  define_primitive_2(mod, "meta-builtin/builtin/assert-not-with-location", x_assert_not_with_location);
  define_primitive_3(mod, "meta-builtin/builtin/assert-equal-with-location", x_assert_equal_with_location);
  define_primitive_3(mod, "meta-builtin/builtin/assert-not-equal-with-location", x_assert_not_equal_with_location);

  // error

  define_primitive_1(mod, "meta-builtin/builtin/error", x_error);
  define_primitive_2(mod, "meta-builtin/builtin/error-with-location", x_error_with_location);

  // sexp

  define_primitive_2(mod, "meta-builtin/builtin/parse-sexps", x_parse_sexps);
  define_primitive_1(mod, "meta-builtin/builtin/format-as-sexp", x_format_as_sexp);
  define_primitive_2(mod, "meta-builtin/builtin/format-message-with-location", x_format_message_with_location);

  // json

  define_primitive_1(mod, "meta-builtin/builtin/parse-json", x_parse_json);
  define_primitive_1(mod, "meta-builtin/builtin/format-json", x_format_json);

  // fs

  define_primitive_1(mod, "meta-builtin/builtin/path-exists", x_path_exists);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-file", x_path_is_file);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-directory", x_path_is_directory);
  define_primitive_1(mod, "meta-builtin/builtin/path-read", x_path_read);
  define_primitive_2(mod, "meta-builtin/builtin/path-write", x_path_write);
  define_primitive_1(mod, "meta-builtin/builtin/path-list", x_path_list);
  define_primitive_1(mod, "meta-builtin/builtin/path-list-recursive", x_path_list_recursive);
  define_primitive_1(mod, "meta-builtin/builtin/path-ensure-file", x_path_ensure_file);
  define_primitive_1(mod, "meta-builtin/builtin/path-ensure-directory", x_path_ensure_directory);
  define_primitive_1(mod, "meta-builtin/builtin/path-delete-file", x_path_delete_file);
  define_primitive_1(mod, "meta-builtin/builtin/path-delete-directory", x_path_delete_directory);
  define_primitive_1(mod, "meta-builtin/builtin/path-delete", x_path_delete);
  define_primitive_2(mod, "meta-builtin/builtin/path-rename", x_path_rename);

  // closure

  define_primitive_2(mod, "meta-builtin/builtin/make-closure", x_make_closure);
  define_primitive_3(mod, "meta-builtin/builtin/closure-put-arg", x_closure_put_arg_mut);
  define_primitive_2(mod, "meta-builtin/builtin/closure-arg", x_closure_arg);

  // process

  define_primitive_1(mod, "meta-builtin/builtin/exit", x_exit);
  define_primitive_0(mod, "meta-builtin/builtin/current-directory", x_current_directory);
  define_primitive_0(mod, "meta-builtin/builtin/current-command-line", x_current_command_line);
  define_primitive_0(mod, "meta-builtin/builtin/current-full-command-line", x_current_full_command_line);
  define_primitive_0(mod, "meta-builtin/builtin/current-stdout-file", x_current_stdout_file);
  define_primitive_0(mod, "meta-builtin/builtin/current-stderr-file", x_current_stderr_file);
}
