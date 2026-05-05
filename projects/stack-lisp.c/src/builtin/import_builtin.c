#include "index.h"

void import_builtin(mod_t *mod) {
  // int

  define_primitive_1(mod, "builtin/int?", x_int_p);
  define_primitive_1(mod, "builtin/ineg", x_ineg);
  define_primitive_2(mod, "builtin/iadd", x_iadd);
  define_primitive_2(mod, "builtin/isub", x_isub);
  define_primitive_2(mod, "builtin/imul", x_imul);
  define_primitive_2(mod, "builtin/idiv", x_idiv);
  define_primitive_2(mod, "builtin/imod", x_imod);
  define_primitive_2(mod, "builtin/int-max", x_int_max);
  define_primitive_2(mod, "builtin/int-min", x_int_min);
  define_primitive_2(mod, "builtin/int-greater?", x_int_greater_p);
  define_primitive_2(mod, "builtin/int-less?", x_int_less_p);
  define_primitive_2(mod, "builtin/int-greater-or-equal?", x_int_greater_or_equal_p);
  define_primitive_2(mod, "builtin/int-less-or-equal?", x_int_less_or_equal_p);
  define_primitive_1(mod, "builtin/int-positive?", x_int_positive_p);
  define_primitive_1(mod, "builtin/int-non-negative?", x_int_non_negative_p);
  define_primitive_1(mod, "builtin/int-non-zero?", x_int_non_zero_p);
  define_primitive_2(mod, "builtin/int-compare-ascending", x_int_compare_ascending);
  define_primitive_2(mod, "builtin/int-compare-descending", x_int_compare_descending);
  define_primitive_1(mod, "builtin/int-to-float", x_int_to_float);

  // float

  define_primitive_1(mod, "builtin/float?", x_float_p);
  define_primitive_1(mod, "builtin/fneg", x_fneg);
  define_primitive_2(mod, "builtin/fadd", x_fadd);
  define_primitive_2(mod, "builtin/fsub", x_fsub);
  define_primitive_2(mod, "builtin/fmul", x_fmul);
  define_primitive_2(mod, "builtin/fdiv", x_fdiv);
  define_primitive_2(mod, "builtin/fmod", x_fmod);
  define_primitive_2(mod, "builtin/float-max", x_float_max);
  define_primitive_2(mod, "builtin/float-min", x_float_min);
  define_primitive_2(mod, "builtin/float-greater?", x_float_greater_p);
  define_primitive_2(mod, "builtin/float-less?", x_float_less_p);
  define_primitive_2(mod, "builtin/float-greater-or-equal?", x_float_greater_or_equal_p);
  define_primitive_2(mod, "builtin/float-less-or-equal?", x_float_less_or_equal_p);
  define_primitive_1(mod, "builtin/float-positive?", x_float_positive_p);
  define_primitive_1(mod, "builtin/float-non-negative?", x_float_non_negative_p);
  define_primitive_1(mod, "builtin/float-non-zero?", x_float_non_zero_p);
  define_primitive_2(mod, "builtin/float-compare-ascending", x_float_compare_ascending);
  define_primitive_2(mod, "builtin/float-compare-descending", x_float_compare_descending);
  define_primitive_1(mod, "builtin/float-to-int", x_float_to_int);

  // bool

  define_variable(mod, "builtin/true", x_true);
  define_variable(mod, "builtin/false", x_false);
  define_primitive_1(mod, "builtin/bool?", x_bool_p);
  define_primitive_1(mod, "builtin/not", x_not);

  // void

  define_variable(mod, "builtin/void", x_void);
  define_primitive_1(mod, "builtin/void?", x_void_p);

  // type

  define_variable_primitive_0(mod, "builtin/type-t", x_type_t);
  define_variable_primitive_0(mod, "builtin/int-t", x_int_t);
  define_variable_primitive_0(mod, "builtin/float-t", x_float_t);
  define_variable_primitive_0(mod, "builtin/string-t", x_string_t);
  define_variable_primitive_0(mod, "builtin/symbol-t", x_symbol_t);
  define_variable_primitive_0(mod, "builtin/keyword-t", x_keyword_t);
  define_variable_primitive_0(mod, "builtin/bool-t", x_bool_t);
  define_variable_primitive_0(mod, "builtin/void-t", x_void_t);
  define_variable_primitive_0(mod, "builtin/file-t", x_file_t);
  define_primitive_1(mod, "builtin/list-t", x_list_t);
  define_primitive_1(mod, "builtin/set-t", x_set_t);
  define_primitive_2(mod, "builtin/hash-t", x_hash_t);

  // value

  define_primitive_1(mod, "builtin/atom?", x_atom_p);
  define_primitive_2(mod, "builtin/same?", x_same_p);
  define_primitive_2(mod, "builtin/equal?", x_equal_p);
  define_primitive_1(mod, "builtin/format", x_format);
  define_primitive_1(mod, "builtin/hash-code", x_hash_code);
  define_primitive_2(mod, "builtin/total-compare", x_total_compare);

  // file

  define_primitive_1(mod, "builtin/open-input-file", x_open_input_file);
  define_primitive_1(mod, "builtin/open-output-file", x_open_output_file);
  define_primitive_1(mod, "builtin/file-close", x_file_close);
  define_primitive_1(mod, "builtin/file-read", x_file_read);
  define_primitive_2(mod, "builtin/file-write", x_file_write);
  define_primitive_2(mod, "builtin/file-writeln", x_file_writeln);
  define_primitive_0(mod, "builtin/newline", x_newline);
  define_primitive_1(mod, "builtin/write", x_write);
  define_primitive_1(mod, "builtin/writeln", x_writeln);
  define_primitive_1(mod, "builtin/print", x_print);
  define_primitive_1(mod, "builtin/println", x_println);

  // path

  define_primitive_1(mod, "builtin/path-base-name", x_path_base_name);
  define_primitive_1(mod, "builtin/path-directory-name", x_path_directory_name);
  define_primitive_1(mod, "builtin/path-extension", x_path_extension);
  define_primitive_1(mod, "builtin/path-stem", x_path_stem);
  define_primitive_1(mod, "builtin/path-absolute?", x_path_absolute_p);
  define_primitive_1(mod, "builtin/path-relative?", x_path_relative_p);
  define_primitive_2(mod, "builtin/path-join", x_path_join);
  define_primitive_1(mod, "builtin/path-normalize", x_path_normalize);

  // random

  define_primitive_2(mod, "builtin/random-int", x_random_int);
  define_primitive_2(mod, "builtin/random-float", x_random_float);

  // keyword

  define_primitive_1(mod, "builtin/keyword?", x_keyword_p);
  define_primitive_1(mod, "builtin/keyword-length", x_keyword_length);
  define_primitive_1(mod, "builtin/keyword-to-string", x_keyword_to_string);
  define_primitive_2(mod, "builtin/keyword-append", x_keyword_append);
  define_primitive_1(mod, "builtin/keyword-concat", x_keyword_concat);

  // symbol

  define_primitive_1(mod, "builtin/symbol?", x_symbol_p);
  define_primitive_1(mod, "builtin/symbol-length", x_symbol_length);
  define_primitive_1(mod, "builtin/symbol-to-string", x_symbol_to_string);
  define_primitive_2(mod, "builtin/symbol-append", x_symbol_append);
  define_primitive_1(mod, "builtin/symbol-concat", x_symbol_concat);

  // string

  define_primitive_1(mod, "builtin/string?", x_string_p);
  define_primitive_1(mod, "builtin/string-length", x_string_length);
  define_primitive_1(mod, "builtin/string-empty?", x_string_empty_p);
  define_primitive_1(mod, "builtin/string-blank?", x_string_blank_p);
  define_primitive_3(mod, "builtin/string-substring", x_string_substring);
  define_primitive_2(mod, "builtin/string-append", x_string_append);
  define_primitive_1(mod, "builtin/string-concat", x_string_concat);
  define_primitive_2(mod, "builtin/string-compare-lexical", x_string_compare_lexical);
  define_primitive_1(mod, "builtin/string-to-symbol", x_string_to_symbol);
  define_primitive_1(mod, "builtin/string-chars", x_string_chars);
  define_primitive_1(mod, "builtin/string-lines", x_string_lines);
  define_primitive_2(mod, "builtin/string-split", x_string_split);
  define_primitive_2(mod, "builtin/string-join", x_string_join);
  define_primitive_3(mod, "builtin/string-replace", x_string_replace);
  define_primitive_2(mod, "builtin/string-starts-with?", x_string_starts_with_p);
  define_primitive_2(mod, "builtin/string-ends-with?", x_string_ends_with_p);
  define_primitive_1(mod, "builtin/string-to-upper-case", x_string_to_upper_case);
  define_primitive_1(mod, "builtin/string-to-lower-case", x_string_to_lower_case);
  define_primitive_2(mod, "builtin/string-get-code-point", x_string_get_code_point);
  define_primitive_2(mod, "builtin/string-contains?", x_string_contains_p);
  define_primitive_2(mod, "builtin/string-find-index", x_string_find_index);
  define_primitive_1(mod, "builtin/string-trim-left", x_string_trim_left);
  define_primitive_1(mod, "builtin/string-trim-right", x_string_trim_right);
  define_primitive_1(mod, "builtin/string-trim-start", x_string_trim_start);
  define_primitive_1(mod, "builtin/string-trim-end", x_string_trim_end);
  define_primitive_1(mod, "builtin/string-trim", x_string_trim);
  define_primitive_1(mod, "builtin/string-int?", x_string_int_p);
  define_primitive_1(mod, "builtin/string-float?", x_string_float_p);

  // list

  define_primitive_0(mod, "builtin/make-list", x_make_list);
  define_primitive_1(mod, "builtin/list?", x_any_list_p);
  define_primitive_1(mod, "builtin/list-copy", x_list_copy);
  define_primitive_1(mod, "builtin/list-length", x_list_length);
  define_primitive_1(mod, "builtin/list-empty?", x_list_empty_p);
  define_primitive_1(mod, "builtin/list-pop!", x_list_pop_mut);
  define_primitive_2(mod, "builtin/list-push!", x_list_push_mut);
  define_primitive_2(mod, "builtin/list-push", x_list_push);
  define_primitive_1(mod, "builtin/list-pop-front!", x_list_pop_front_mut);
  define_primitive_2(mod, "builtin/list-push-front!", x_list_push_front_mut);
  define_primitive_2(mod, "builtin/list-get", x_list_get);
  define_primitive_3(mod, "builtin/list-put!", x_list_put_mut);
  define_primitive_3(mod, "builtin/list-put", x_list_put);
  define_primitive_1(mod, "builtin/car", x_car);
  define_primitive_1(mod, "builtin/cdr", x_cdr);
  define_primitive_2(mod, "builtin/cons", x_cons);
  define_primitive_1(mod, "builtin/list-head", x_list_head);
  define_primitive_1(mod, "builtin/list-tail", x_list_tail);
  define_primitive_1(mod, "builtin/list-init", x_list_init);
  define_primitive_1(mod, "builtin/list-last", x_list_last);
  define_primitive_1(mod, "builtin/list-reverse!", x_list_reverse_mut);
  define_primitive_1(mod, "builtin/list-reverse", x_list_reverse);
  define_primitive_1(mod, "builtin/list-to-set", x_list_to_set);

  // record

  define_primitive_0(mod, "builtin/make-record", x_make_record);
  define_primitive_1(mod, "builtin/record?", x_any_record_p);
  define_primitive_1(mod, "builtin/record-copy", x_record_copy);
  define_primitive_1(mod, "builtin/record-length", x_record_length);
  define_primitive_1(mod, "builtin/record-empty?", x_record_empty_p);
  define_primitive_2(mod, "builtin/record-get", x_record_get);
  define_primitive_2(mod, "builtin/record-has?", x_record_has_p);
  define_primitive_3(mod, "builtin/record-put!", x_record_put_mut);
  define_primitive_3(mod, "builtin/record-put", x_record_put);
  define_primitive_2(mod, "builtin/record-delete!", x_record_delete_mut);
  define_primitive_2(mod, "builtin/record-delete", x_record_delete);
  define_primitive_2(mod, "builtin/record-append", x_record_append);
  define_primitive_1(mod, "builtin/record-keys", x_record_keys);
  define_primitive_1(mod, "builtin/record-values", x_record_values);
  define_primitive_1(mod, "builtin/record-entries", x_record_entries);

  // hash

  define_primitive_0(mod, "builtin/make-hash", x_make_hash);
  define_primitive_1(mod, "builtin/hash?", x_any_hash_p);
  define_primitive_1(mod, "builtin/hash-copy", x_hash_copy);
  define_primitive_1(mod, "builtin/hash-length", x_hash_length);
  define_primitive_1(mod, "builtin/hash-empty?", x_hash_empty_p);
  define_primitive_2(mod, "builtin/hash-get", x_hash_get);
  define_primitive_2(mod, "builtin/hash-has?", x_hash_has_p);
  define_primitive_3(mod, "builtin/hash-put!", x_hash_put_mut);
  define_primitive_3(mod, "builtin/hash-put", x_hash_put);
  define_primitive_2(mod, "builtin/hash-delete!", x_hash_delete_mut);
  define_primitive_2(mod, "builtin/hash-delete", x_hash_delete);
  define_primitive_1(mod, "builtin/hash-keys", x_hash_keys);
  define_primitive_1(mod, "builtin/hash-values", x_hash_values);
  define_primitive_1(mod, "builtin/hash-entries", x_hash_entries);

  // set

  define_primitive_0(mod, "builtin/make-set", x_make_set);
  define_primitive_1(mod, "builtin/set?", x_any_set_p);
  define_primitive_1(mod, "builtin/set-copy", x_set_copy);
  define_primitive_1(mod, "builtin/set-size", x_set_size);
  define_primitive_1(mod, "builtin/set-empty?", x_set_empty_p);
  define_primitive_2(mod, "builtin/set-member?", x_set_member_p);
  define_primitive_2(mod, "builtin/set-add!", x_set_add_mut);
  define_primitive_2(mod, "builtin/set-add", x_set_add);
  define_primitive_2(mod, "builtin/set-delete!", x_set_delete_mut);
  define_primitive_2(mod, "builtin/set-delete", x_set_delete);
  define_primitive_1(mod, "builtin/set-clear!", x_set_clear_mut);
  define_primitive_2(mod, "builtin/set-union", x_set_union);
  define_primitive_2(mod, "builtin/set-inter", x_set_inter);
  define_primitive_2(mod, "builtin/set-difference", x_set_difference);
  define_primitive_2(mod, "builtin/set-subset?", x_set_subset_p);
  define_primitive_2(mod, "builtin/set-disjoint?", x_set_disjoint_p);
  define_primitive_1(mod, "builtin/set-to-list", x_set_to_list);

  // assert

  define_primitive_1(mod, "builtin/assert", x_assert);
  define_primitive_1(mod, "builtin/assert-not", x_assert_not);
  define_primitive_2(mod, "builtin/assert-equal", x_assert_equal);
  define_primitive_2(mod, "builtin/assert-not-equal", x_assert_not_equal);
  define_primitive_2(mod, "builtin/assert-with-location", x_assert_with_location);
  define_primitive_2(mod, "builtin/assert-not-with-location", x_assert_not_with_location);
  define_primitive_3(mod, "builtin/assert-equal-with-location", x_assert_equal_with_location);
  define_primitive_3(mod, "builtin/assert-not-equal-with-location", x_assert_not_equal_with_location);

  // error

  define_primitive_1(mod, "builtin/error", x_error);
  define_primitive_2(mod, "builtin/error-with-location", x_error_with_location);

  // sexp

  define_primitive_2(mod, "builtin/parse-located-sexps", x_parse_located_sexps);
  define_primitive_1(mod, "builtin/format-sexp", x_format_sexp);

  // fs

  define_primitive_1(mod, "builtin/fs-exists?", x_fs_exists_p);
  define_primitive_1(mod, "builtin/fs-file?", x_fs_file_p);
  define_primitive_1(mod, "builtin/fs-directory?", x_fs_directory_p);
  define_primitive_1(mod, "builtin/fs-read", x_fs_read);
  define_primitive_2(mod, "builtin/fs-write", x_fs_write);
  define_primitive_1(mod, "builtin/fs-list", x_fs_list);
  define_primitive_1(mod, "builtin/fs-list-recursive", x_fs_list_recursive);
  define_primitive_1(mod, "builtin/fs-ensure-file", x_fs_ensure_file);
  define_primitive_1(mod, "builtin/fs-ensure-directory", x_fs_ensure_directory);
  define_primitive_1(mod, "builtin/fs-delete-file", x_fs_delete_file);
  define_primitive_1(mod, "builtin/fs-delete-directory", x_fs_delete_directory);
  define_primitive_1(mod, "builtin/fs-delete", x_fs_delete);
  define_primitive_2(mod, "builtin/fs-rename", x_fs_rename);

  // process

  define_primitive_1(mod, "builtin/exit", x_exit);
  define_primitive_0(mod, "builtin/current-directory", x_current_directory);
}
