#include "index.h"

void import_builtin(mod_t *mod) {
  // int

  define_primitive_1(mod, "meta-builtin/builtin/is-int", x_is_int);
  define_primitive_1(mod, "meta-builtin/builtin/为整数", x_is_int);
  define_primitive_1(mod, "meta-builtin/builtin/ineg", x_ineg);
  define_primitive_1(mod, "meta-builtin/builtin/整数负", x_ineg);
  define_primitive_2(mod, "meta-builtin/builtin/iadd", x_iadd);
  define_primitive_2(mod, "meta-builtin/builtin/整数加", x_iadd);
  define_primitive_2(mod, "meta-builtin/builtin/isub", x_isub);
  define_primitive_2(mod, "meta-builtin/builtin/整数减", x_isub);
  define_primitive_2(mod, "meta-builtin/builtin/imul", x_imul);
  define_primitive_2(mod, "meta-builtin/builtin/整数乘", x_imul);
  define_primitive_2(mod, "meta-builtin/builtin/idiv", x_idiv);
  define_primitive_2(mod, "meta-builtin/builtin/整数除", x_idiv);
  define_primitive_2(mod, "meta-builtin/builtin/imod", x_imod);
  define_primitive_2(mod, "meta-builtin/builtin/整数模", x_imod);
  define_primitive_2(mod, "meta-builtin/builtin/int-max", x_int_max);
  define_primitive_2(mod, "meta-builtin/builtin/整数最大", x_int_max);
  define_primitive_2(mod, "meta-builtin/builtin/int-min", x_int_min);
  define_primitive_2(mod, "meta-builtin/builtin/整数最小", x_int_min);
  define_primitive_2(mod, "meta-builtin/builtin/int-greater", x_int_greater);
  define_primitive_2(mod, "meta-builtin/builtin/整数大于", x_int_greater);
  define_primitive_2(mod, "meta-builtin/builtin/int-less", x_int_less);
  define_primitive_2(mod, "meta-builtin/builtin/整数小于", x_int_less);
  define_primitive_2(mod, "meta-builtin/builtin/int-greater-or-equal", x_int_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/整数大于等于", x_int_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/int-less-or-equal", x_int_less_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/整数小于等于", x_int_less_or_equal);
  define_primitive_1(mod, "meta-builtin/builtin/int-is-positive", x_int_positive);
  define_primitive_1(mod, "meta-builtin/builtin/整数为正", x_int_positive);
  define_primitive_1(mod, "meta-builtin/builtin/int-is-non-negative", x_int_non_negative);
  define_primitive_1(mod, "meta-builtin/builtin/整数为非负", x_int_non_negative);
  define_primitive_1(mod, "meta-builtin/builtin/int-is-non-zero", x_int_non_zero);
  define_primitive_1(mod, "meta-builtin/builtin/整数为非零", x_int_non_zero);
  define_primitive_2(mod, "meta-builtin/builtin/int-compare-ascending", x_int_compare_ascending);
  define_primitive_2(mod, "meta-builtin/builtin/整数升序比较", x_int_compare_ascending);
  define_primitive_2(mod, "meta-builtin/builtin/int-compare-descending", x_int_compare_descending);
  define_primitive_2(mod, "meta-builtin/builtin/整数降序比较", x_int_compare_descending);
  define_primitive_1(mod, "meta-builtin/builtin/int-to-float", x_int_to_float);
  define_primitive_1(mod, "meta-builtin/builtin/整数转浮点", x_int_to_float);

  // float

  define_primitive_1(mod, "meta-builtin/builtin/is-float", x_is_float);
  define_primitive_1(mod, "meta-builtin/builtin/为浮点", x_is_float);
  define_primitive_1(mod, "meta-builtin/builtin/fneg", x_fneg);
  define_primitive_1(mod, "meta-builtin/builtin/浮点负", x_fneg);
  define_primitive_2(mod, "meta-builtin/builtin/fadd", x_fadd);
  define_primitive_2(mod, "meta-builtin/builtin/浮点加", x_fadd);
  define_primitive_2(mod, "meta-builtin/builtin/fsub", x_fsub);
  define_primitive_2(mod, "meta-builtin/builtin/浮点减", x_fsub);
  define_primitive_2(mod, "meta-builtin/builtin/fmul", x_fmul);
  define_primitive_2(mod, "meta-builtin/builtin/浮点乘", x_fmul);
  define_primitive_2(mod, "meta-builtin/builtin/fdiv", x_fdiv);
  define_primitive_2(mod, "meta-builtin/builtin/浮点除", x_fdiv);
  define_primitive_2(mod, "meta-builtin/builtin/fmod", x_fmod);
  define_primitive_2(mod, "meta-builtin/builtin/浮点模", x_fmod);
  define_primitive_2(mod, "meta-builtin/builtin/float-max", x_float_max);
  define_primitive_2(mod, "meta-builtin/builtin/浮点最大", x_float_max);
  define_primitive_2(mod, "meta-builtin/builtin/float-min", x_float_min);
  define_primitive_2(mod, "meta-builtin/builtin/浮点最小", x_float_min);
  define_primitive_2(mod, "meta-builtin/builtin/float-greater", x_float_greater);
  define_primitive_2(mod, "meta-builtin/builtin/浮点大于", x_float_greater);
  define_primitive_2(mod, "meta-builtin/builtin/float-less", x_float_less);
  define_primitive_2(mod, "meta-builtin/builtin/浮点小于", x_float_less);
  define_primitive_2(mod, "meta-builtin/builtin/float-greater-or-equal", x_float_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/浮点大于等于", x_float_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/float-less-or-equal", x_float_less_or_equal);
  define_primitive_2(mod, "meta-builtin/builtin/浮点小于等于", x_float_less_or_equal);
  define_primitive_1(mod, "meta-builtin/builtin/float-is-positive", x_float_positive);
  define_primitive_1(mod, "meta-builtin/builtin/浮点为正", x_float_positive);
  define_primitive_1(mod, "meta-builtin/builtin/float-is-non-negative", x_float_non_negative);
  define_primitive_1(mod, "meta-builtin/builtin/浮点为非负", x_float_non_negative);
  define_primitive_1(mod, "meta-builtin/builtin/float-is-non-zero", x_float_non_zero);
  define_primitive_1(mod, "meta-builtin/builtin/浮点为非零", x_float_non_zero);
  define_primitive_2(mod, "meta-builtin/builtin/float-compare-ascending", x_float_compare_ascending);
  define_primitive_2(mod, "meta-builtin/builtin/浮点升序比较", x_float_compare_ascending);
  define_primitive_2(mod, "meta-builtin/builtin/float-compare-descending", x_float_compare_descending);
  define_primitive_2(mod, "meta-builtin/builtin/浮点降序比较", x_float_compare_descending);
  define_primitive_1(mod, "meta-builtin/builtin/float-to-int", x_float_to_int);
  define_primitive_1(mod, "meta-builtin/builtin/浮点转整数", x_float_to_int);

  // bool

  define_variable(mod, "meta-builtin/builtin/true", x_true);
  define_variable(mod, "meta-builtin/builtin/真", x_true);
  define_variable(mod, "meta-builtin/builtin/false", x_false);
  define_variable(mod, "meta-builtin/builtin/假", x_false);
  define_primitive_1(mod, "meta-builtin/builtin/is-bool", x_is_bool);
  define_primitive_1(mod, "meta-builtin/builtin/为布尔", x_is_bool);
  define_primitive_1(mod, "meta-builtin/builtin/not", x_not);
  define_primitive_1(mod, "meta-builtin/builtin/非", x_not);

  // void

  define_variable(mod, "meta-builtin/builtin/void", x_void);
  define_variable(mod, "meta-builtin/builtin/空", x_void);
  define_primitive_1(mod, "meta-builtin/builtin/is-void", x_is_void);
  define_primitive_1(mod, "meta-builtin/builtin/为空", x_is_void);

  // type

  define_variable_primitive_0(mod, "meta-builtin/builtin/type-t", x_type_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/类型型", x_type_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/any-t", x_any_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/任意型", x_any_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/int-t", x_int_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/整数型", x_int_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/float-t", x_float_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/浮点型", x_float_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/string-t", x_string_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/字符串型", x_string_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/symbol-t", x_symbol_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/符号型", x_symbol_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/keyword-t", x_keyword_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/关键字型", x_keyword_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/bool-t", x_bool_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/布尔型", x_bool_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/void-t", x_void_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/空型", x_void_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/file-t", x_file_t);
  define_variable_primitive_0(mod, "meta-builtin/builtin/文件型", x_file_t);
  define_primitive_1(mod, "meta-builtin/builtin/list-t", x_list_t);
  define_primitive_1(mod, "meta-builtin/builtin/列表型", x_list_t);
  define_primitive_1(mod, "meta-builtin/builtin/set-t", x_set_t);
  define_primitive_1(mod, "meta-builtin/builtin/集合型", x_set_t);
  define_primitive_2(mod, "meta-builtin/builtin/hash-t", x_hash_t);
  define_primitive_2(mod, "meta-builtin/builtin/散列型", x_hash_t);

  // value

  define_primitive_1(mod, "meta-builtin/builtin/is-atom", x_is_atom);
  define_primitive_1(mod, "meta-builtin/builtin/为原子", x_is_atom);
  define_primitive_2(mod, "meta-builtin/builtin/same", x_same);
  define_primitive_2(mod, "meta-builtin/builtin/相同", x_same);
  define_primitive_2(mod, "meta-builtin/builtin/equal", x_equal);
  define_primitive_2(mod, "meta-builtin/builtin/相等", x_equal);
  define_primitive_1(mod, "meta-builtin/builtin/format", x_format);
  define_primitive_1(mod, "meta-builtin/builtin/呈现", x_format);
  define_primitive_1(mod, "meta-builtin/builtin/hash-code", x_hash_code);
  define_primitive_1(mod, "meta-builtin/builtin/散列码", x_hash_code);
  define_primitive_2(mod, "meta-builtin/builtin/total-compare", x_total_compare);
  define_primitive_2(mod, "meta-builtin/builtin/全序比较", x_total_compare);

  // file

  define_primitive_1(mod, "meta-builtin/builtin/open-input-file", x_open_input_file);
  define_primitive_1(mod, "meta-builtin/builtin/打开输入文件", x_open_input_file);
  define_primitive_1(mod, "meta-builtin/builtin/open-output-file", x_open_output_file);
  define_primitive_1(mod, "meta-builtin/builtin/打开输出文件", x_open_output_file);
  define_primitive_1(mod, "meta-builtin/builtin/file-close", x_file_close);
  define_primitive_1(mod, "meta-builtin/builtin/文件关闭", x_file_close);
  define_primitive_1(mod, "meta-builtin/builtin/file-read", x_file_read);
  define_primitive_1(mod, "meta-builtin/builtin/文件读", x_file_read);
  define_primitive_2(mod, "meta-builtin/builtin/file-write", x_file_write);
  define_primitive_2(mod, "meta-builtin/builtin/文件写", x_file_write);
  define_primitive_2(mod, "meta-builtin/builtin/file-writeln", x_file_writeln);
  define_primitive_2(mod, "meta-builtin/builtin/文件写行", x_file_writeln);
  define_primitive_1(mod, "meta-builtin/builtin/print", x_print);
  define_primitive_1(mod, "meta-builtin/builtin/打印", x_print);
  define_primitive_1(mod, "meta-builtin/builtin/println", x_println);
  define_primitive_1(mod, "meta-builtin/builtin/打印行", x_println);

  // path

  define_primitive_1(mod, "meta-builtin/builtin/path-base-name", x_path_base_name);
  define_primitive_1(mod, "meta-builtin/builtin/路径取文件名", x_path_base_name);
  define_primitive_1(mod, "meta-builtin/builtin/path-directory-name", x_path_directory_name);
  define_primitive_1(mod, "meta-builtin/builtin/路径取目录名", x_path_directory_name);
  define_primitive_1(mod, "meta-builtin/builtin/path-extension", x_path_extension);
  define_primitive_1(mod, "meta-builtin/builtin/路径取扩展名", x_path_extension);
  define_primitive_1(mod, "meta-builtin/builtin/path-stem", x_path_stem);
  define_primitive_1(mod, "meta-builtin/builtin/路径取主干", x_path_stem);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-absolute", x_path_is_absolute);
  define_primitive_1(mod, "meta-builtin/builtin/路径为绝对", x_path_is_absolute);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-relative", x_path_is_relative);
  define_primitive_1(mod, "meta-builtin/builtin/路径为相对", x_path_is_relative);
  define_primitive_2(mod, "meta-builtin/builtin/path-join", x_path_join);
  define_primitive_2(mod, "meta-builtin/builtin/路径连接", x_path_join);
  define_primitive_1(mod, "meta-builtin/builtin/path-normalize", x_path_normalize);
  define_primitive_1(mod, "meta-builtin/builtin/路径标准化", x_path_normalize);
  define_primitive_2(mod, "meta-builtin/builtin/path-relative", x_path_relative);
  define_primitive_2(mod, "meta-builtin/builtin/路径相对化", x_path_relative);
  define_primitive_1(mod, "meta-builtin/builtin/path-relative-to-cwd", x_path_relative_to_cwd);
  define_primitive_1(mod, "meta-builtin/builtin/路径相对于当前目录", x_path_relative_to_cwd);
  define_primitive_1(mod, "meta-builtin/builtin/path-resolve", x_path_resolve);
  define_primitive_1(mod, "meta-builtin/builtin/路径解析", x_path_resolve);

  // random

  define_primitive_2(mod, "meta-builtin/builtin/random-int", x_random_int);
  define_primitive_2(mod, "meta-builtin/builtin/随机整数", x_random_int);
  define_primitive_2(mod, "meta-builtin/builtin/random-float", x_random_float);
  define_primitive_2(mod, "meta-builtin/builtin/随机浮点", x_random_float);

  // keyword

  define_primitive_1(mod, "meta-builtin/builtin/is-keyword", x_is_keyword);
  define_primitive_1(mod, "meta-builtin/builtin/为关键字", x_is_keyword);
  define_primitive_1(mod, "meta-builtin/builtin/keyword-length", x_keyword_length);
  define_primitive_1(mod, "meta-builtin/builtin/关键字长度", x_keyword_length);
  define_primitive_1(mod, "meta-builtin/builtin/keyword-to-string", x_keyword_to_string);
  define_primitive_1(mod, "meta-builtin/builtin/关键字转字符串", x_keyword_to_string);
  define_primitive_2(mod, "meta-builtin/builtin/keyword-append", x_keyword_append);
  define_primitive_2(mod, "meta-builtin/builtin/关键字拼接", x_keyword_append);
  define_primitive_1(mod, "meta-builtin/builtin/keyword-concat", x_keyword_concat);
  define_primitive_1(mod, "meta-builtin/builtin/关键字连接", x_keyword_concat);

  // symbol

  define_primitive_1(mod, "meta-builtin/builtin/is-symbol", x_is_symbol);
  define_primitive_1(mod, "meta-builtin/builtin/为符号", x_is_symbol);
  define_primitive_1(mod, "meta-builtin/builtin/symbol-length", x_symbol_length);
  define_primitive_1(mod, "meta-builtin/builtin/符号长度", x_symbol_length);
  define_primitive_1(mod, "meta-builtin/builtin/symbol-to-string", x_symbol_to_string);
  define_primitive_1(mod, "meta-builtin/builtin/符号转字符串", x_symbol_to_string);
  define_primitive_2(mod, "meta-builtin/builtin/symbol-append", x_symbol_append);
  define_primitive_2(mod, "meta-builtin/builtin/符号拼接", x_symbol_append);
  define_primitive_1(mod, "meta-builtin/builtin/symbol-concat", x_symbol_concat);
  define_primitive_1(mod, "meta-builtin/builtin/符号连接", x_symbol_concat);

  // string

  define_primitive_1(mod, "meta-builtin/builtin/is-string", x_is_string);
  define_primitive_1(mod, "meta-builtin/builtin/为字符串", x_is_string);
  define_primitive_1(mod, "meta-builtin/builtin/string-length", x_string_length);
  define_primitive_1(mod, "meta-builtin/builtin/字符串长度", x_string_length);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-empty", x_string_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/字符串为空", x_string_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-blank", x_string_is_blank);
  define_primitive_1(mod, "meta-builtin/builtin/字符串为空白", x_string_is_blank);
  define_primitive_3(mod, "meta-builtin/builtin/string-substring", x_string_substring);
  define_primitive_3(mod, "meta-builtin/builtin/字符串子串", x_string_substring);
  define_primitive_2(mod, "meta-builtin/builtin/string-append", x_string_append);
  define_primitive_2(mod, "meta-builtin/builtin/字符串拼接", x_string_append);
  define_primitive_1(mod, "meta-builtin/builtin/string-concat", x_string_concat);
  define_primitive_1(mod, "meta-builtin/builtin/字符串连接", x_string_concat);
  define_primitive_2(mod, "meta-builtin/builtin/string-compare-lexical", x_string_compare_lexical);
  define_primitive_2(mod, "meta-builtin/builtin/字符串字典序比较", x_string_compare_lexical);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-symbol", x_string_to_symbol);
  define_primitive_1(mod, "meta-builtin/builtin/字符串转符号", x_string_to_symbol);
  define_primitive_1(mod, "meta-builtin/builtin/string-chars", x_string_chars);
  define_primitive_1(mod, "meta-builtin/builtin/字符串字符", x_string_chars);
  define_primitive_1(mod, "meta-builtin/builtin/string-lines", x_string_lines);
  define_primitive_1(mod, "meta-builtin/builtin/字符串行", x_string_lines);
  define_primitive_2(mod, "meta-builtin/builtin/string-split", x_string_split);
  define_primitive_2(mod, "meta-builtin/builtin/字符串分割", x_string_split);
  define_primitive_2(mod, "meta-builtin/builtin/string-join", x_string_join);
  define_primitive_2(mod, "meta-builtin/builtin/字符串合并", x_string_join);
  define_primitive_3(mod, "meta-builtin/builtin/string-replace", x_string_replace);
  define_primitive_3(mod, "meta-builtin/builtin/字符串替换", x_string_replace);
  define_primitive_2(mod, "meta-builtin/builtin/string-starts-with", x_string_starts_with);
  define_primitive_2(mod, "meta-builtin/builtin/字符串起首", x_string_starts_with);
  define_primitive_2(mod, "meta-builtin/builtin/string-ends-with", x_string_ends_with);
  define_primitive_2(mod, "meta-builtin/builtin/字符串结尾", x_string_ends_with);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-upper-case", x_string_to_upper_case);
  define_primitive_1(mod, "meta-builtin/builtin/字符串转大写", x_string_to_upper_case);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-lower-case", x_string_to_lower_case);
  define_primitive_1(mod, "meta-builtin/builtin/字符串转小写", x_string_to_lower_case);
  define_primitive_2(mod, "meta-builtin/builtin/string-get-code-point", x_string_get_code_point);
  define_primitive_2(mod, "meta-builtin/builtin/字符串取码点", x_string_get_code_point);
  define_primitive_2(mod, "meta-builtin/builtin/string-contains", x_string_contains);
  define_primitive_2(mod, "meta-builtin/builtin/字符串包含", x_string_contains);
  define_primitive_2(mod, "meta-builtin/builtin/string-find-index", x_string_find_index);
  define_primitive_2(mod, "meta-builtin/builtin/字符串查找索引", x_string_find_index);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-left", x_string_trim_left);
  define_primitive_1(mod, "meta-builtin/builtin/字符串修剪左", x_string_trim_left);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-right", x_string_trim_right);
  define_primitive_1(mod, "meta-builtin/builtin/字符串修剪右", x_string_trim_right);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-start", x_string_trim_start);
  define_primitive_1(mod, "meta-builtin/builtin/字符串修剪首", x_string_trim_start);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim-end", x_string_trim_end);
  define_primitive_1(mod, "meta-builtin/builtin/字符串修剪尾", x_string_trim_end);
  define_primitive_1(mod, "meta-builtin/builtin/string-trim", x_string_trim);
  define_primitive_1(mod, "meta-builtin/builtin/字符串修剪", x_string_trim);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-int", x_string_is_int);
  define_primitive_1(mod, "meta-builtin/builtin/字符串为整数", x_string_is_int);
  define_primitive_1(mod, "meta-builtin/builtin/string-is-float", x_string_is_float);
  define_primitive_1(mod, "meta-builtin/builtin/字符串为浮点", x_string_is_float);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-int", x_string_to_int);
  define_primitive_1(mod, "meta-builtin/builtin/字符串转整数", x_string_to_int);
  define_primitive_1(mod, "meta-builtin/builtin/string-to-float", x_string_to_float);
  define_primitive_1(mod, "meta-builtin/builtin/字符串转浮点", x_string_to_float);

  // list

  define_primitive_0(mod, "meta-builtin/builtin/make-list", x_make_list);
  define_primitive_0(mod, "meta-builtin/builtin/作列表", x_make_list);
  define_primitive_1(mod, "meta-builtin/builtin/is-list", x_is_any_list);
  define_primitive_1(mod, "meta-builtin/builtin/为列表", x_is_any_list);
  define_primitive_1(mod, "meta-builtin/builtin/list-copy", x_list_copy);
  define_primitive_1(mod, "meta-builtin/builtin/列表复制", x_list_copy);
  define_primitive_1(mod, "meta-builtin/builtin/list-length", x_list_length);
  define_primitive_1(mod, "meta-builtin/builtin/列表长度", x_list_length);
  define_primitive_1(mod, "meta-builtin/builtin/list-is-empty", x_list_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/列表为空", x_list_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/list-pop!", x_list_pop_mut);
  define_primitive_1(mod, "meta-builtin/builtin/列表末出之", x_list_pop_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-push!", x_list_push_mut);
  define_primitive_2(mod, "meta-builtin/builtin/列表末入之", x_list_push_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-push", x_list_push);
  define_primitive_2(mod, "meta-builtin/builtin/列表末入", x_list_push);
  define_primitive_1(mod, "meta-builtin/builtin/list-pop-front!", x_list_pop_front_mut);
  define_primitive_1(mod, "meta-builtin/builtin/列表首出之", x_list_pop_front_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-push-front!", x_list_push_front_mut);
  define_primitive_2(mod, "meta-builtin/builtin/列表首入之", x_list_push_front_mut);
  define_primitive_2(mod, "meta-builtin/builtin/list-get", x_list_get);
  define_primitive_2(mod, "meta-builtin/builtin/列表取", x_list_get);
  define_primitive_3(mod, "meta-builtin/builtin/list-put!", x_list_put_mut);
  define_primitive_3(mod, "meta-builtin/builtin/列表置之", x_list_put_mut);
  define_primitive_3(mod, "meta-builtin/builtin/list-put", x_list_put);
  define_primitive_3(mod, "meta-builtin/builtin/列表置", x_list_put);
  define_primitive_1(mod, "meta-builtin/builtin/car", x_car);
  define_primitive_1(mod, "meta-builtin/builtin/首", x_car);
  define_primitive_1(mod, "meta-builtin/builtin/cdr", x_cdr);
  define_primitive_1(mod, "meta-builtin/builtin/余", x_cdr);
  define_primitive_2(mod, "meta-builtin/builtin/cons", x_cons);
  define_primitive_2(mod, "meta-builtin/builtin/添", x_cons);
  define_primitive_1(mod, "meta-builtin/builtin/list-head", x_list_head);
  define_primitive_1(mod, "meta-builtin/builtin/列表首", x_list_head);
  define_primitive_1(mod, "meta-builtin/builtin/list-tail", x_list_tail);
  define_primitive_1(mod, "meta-builtin/builtin/列表余", x_list_tail);
  define_primitive_1(mod, "meta-builtin/builtin/list-init", x_list_init);
  define_primitive_1(mod, "meta-builtin/builtin/列表除末", x_list_init);
  define_primitive_1(mod, "meta-builtin/builtin/list-last", x_list_last);
  define_primitive_1(mod, "meta-builtin/builtin/列表末", x_list_last);
  define_primitive_1(mod, "meta-builtin/builtin/list-reverse!", x_list_reverse_mut);
  define_primitive_1(mod, "meta-builtin/builtin/list-reverse", x_list_reverse);
  define_primitive_1(mod, "meta-builtin/builtin/列表反转", x_list_reverse);
  define_primitive_1(mod, "meta-builtin/builtin/list-to-set", x_list_to_set);
  define_primitive_1(mod, "meta-builtin/builtin/列表转集合", x_list_to_set);

  // hash

  define_primitive_0(mod, "meta-builtin/builtin/make-hash", x_make_hash);
  define_primitive_0(mod, "meta-builtin/builtin/作散列", x_make_hash);
  define_primitive_1(mod, "meta-builtin/builtin/is-hash", x_is_any_hash);
  define_primitive_1(mod, "meta-builtin/builtin/为散列", x_is_any_hash);
  define_primitive_1(mod, "meta-builtin/builtin/hash-copy", x_hash_copy);
  define_primitive_1(mod, "meta-builtin/builtin/散列复制", x_hash_copy);
  define_primitive_1(mod, "meta-builtin/builtin/hash-length", x_hash_length);
  define_primitive_1(mod, "meta-builtin/builtin/散列长度", x_hash_length);
  define_primitive_1(mod, "meta-builtin/builtin/hash-is-empty", x_hash_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/散列为空", x_hash_is_empty);
  define_primitive_2(mod, "meta-builtin/builtin/hash-get", x_hash_get);
  define_primitive_2(mod, "meta-builtin/builtin/散列取", x_hash_get);
  define_primitive_2(mod, "meta-builtin/builtin/hash-has", x_hash_has);
  define_primitive_2(mod, "meta-builtin/builtin/散列有", x_hash_has);
  define_primitive_3(mod, "meta-builtin/builtin/hash-put!", x_hash_put_mut);
  define_primitive_3(mod, "meta-builtin/builtin/散列置之", x_hash_put_mut);
  define_primitive_3(mod, "meta-builtin/builtin/hash-put", x_hash_put);
  define_primitive_3(mod, "meta-builtin/builtin/散列置", x_hash_put);
  define_primitive_2(mod, "meta-builtin/builtin/hash-delete!", x_hash_delete_mut);
  define_primitive_2(mod, "meta-builtin/builtin/散列删除之", x_hash_delete_mut);
  define_primitive_2(mod, "meta-builtin/builtin/hash-delete", x_hash_delete);
  define_primitive_1(mod, "meta-builtin/builtin/hash-keys", x_hash_keys);
  define_primitive_1(mod, "meta-builtin/builtin/散列键", x_hash_keys);
  define_primitive_1(mod, "meta-builtin/builtin/hash-values", x_hash_values);
  define_primitive_1(mod, "meta-builtin/builtin/散列值", x_hash_values);
  define_primitive_1(mod, "meta-builtin/builtin/hash-entries", x_hash_entries);
  define_primitive_1(mod, "meta-builtin/builtin/散列条目", x_hash_entries);

  // set

  define_primitive_0(mod, "meta-builtin/builtin/make-set", x_make_set);
  define_primitive_0(mod, "meta-builtin/builtin/作集合", x_make_set);
  define_primitive_1(mod, "meta-builtin/builtin/is-set", x_is_any_set);
  define_primitive_1(mod, "meta-builtin/builtin/为集合", x_is_any_set);
  define_primitive_1(mod, "meta-builtin/builtin/set-copy", x_set_copy);
  define_primitive_1(mod, "meta-builtin/builtin/集合复制", x_set_copy);
  define_primitive_1(mod, "meta-builtin/builtin/set-size", x_set_size);
  define_primitive_1(mod, "meta-builtin/builtin/集合大小", x_set_size);
  define_primitive_1(mod, "meta-builtin/builtin/set-is-empty", x_set_is_empty);
  define_primitive_1(mod, "meta-builtin/builtin/集合为空", x_set_is_empty);
  define_primitive_2(mod, "meta-builtin/builtin/set-is-member", x_set_is_member);
  define_primitive_2(mod, "meta-builtin/builtin/集合属于", x_set_is_member);
  define_primitive_2(mod, "meta-builtin/builtin/set-add!", x_set_add_mut);
  define_primitive_2(mod, "meta-builtin/builtin/集合添加之", x_set_add_mut);
  define_primitive_2(mod, "meta-builtin/builtin/set-add", x_set_add);
  define_primitive_2(mod, "meta-builtin/builtin/集合添加", x_set_add);
  define_primitive_2(mod, "meta-builtin/builtin/set-delete!", x_set_delete_mut);
  define_primitive_2(mod, "meta-builtin/builtin/集合删除之", x_set_delete_mut);
  define_primitive_2(mod, "meta-builtin/builtin/set-delete", x_set_delete);
  define_primitive_2(mod, "meta-builtin/builtin/集合删除", x_set_delete);
  define_primitive_1(mod, "meta-builtin/builtin/set-clear!", x_set_clear_mut);
  define_primitive_1(mod, "meta-builtin/builtin/集合清空之", x_set_clear_mut);
  define_primitive_2(mod, "meta-builtin/builtin/set-union", x_set_union);
  define_primitive_2(mod, "meta-builtin/builtin/集合并", x_set_union);
  define_primitive_2(mod, "meta-builtin/builtin/set-inter", x_set_inter);
  define_primitive_2(mod, "meta-builtin/builtin/集合交", x_set_inter);
  define_primitive_2(mod, "meta-builtin/builtin/set-difference", x_set_difference);
  define_primitive_2(mod, "meta-builtin/builtin/集合差", x_set_difference);
  define_primitive_2(mod, "meta-builtin/builtin/set-subset", x_set_subset);
  define_primitive_2(mod, "meta-builtin/builtin/集合子集", x_set_subset);
  define_primitive_2(mod, "meta-builtin/builtin/set-disjoint", x_set_disjoint);
  define_primitive_2(mod, "meta-builtin/builtin/集合不相交", x_set_disjoint);
  define_primitive_1(mod, "meta-builtin/builtin/set-to-list", x_set_to_list);
  define_primitive_1(mod, "meta-builtin/builtin/集合转列表", x_set_to_list);

  // assert

  define_primitive_1(mod, "meta-builtin/builtin/assert", x_assert);
  define_primitive_1(mod, "meta-builtin/builtin/断言", x_assert);
  define_primitive_1(mod, "meta-builtin/builtin/assert-not", x_assert_not);
  define_primitive_1(mod, "meta-builtin/builtin/断言非", x_assert_not);
  define_primitive_2(mod, "meta-builtin/builtin/assert-equal", x_assert_equal);
  define_primitive_2(mod, "meta-builtin/builtin/断言相等", x_assert_equal);
  define_primitive_2(mod, "meta-builtin/builtin/assert-not-equal", x_assert_not_equal);
  define_primitive_2(mod, "meta-builtin/builtin/断言不等", x_assert_not_equal);
  define_primitive_2(mod, "meta-builtin/builtin/assert-with-location", x_assert_with_location);
  define_primitive_2(mod, "meta-builtin/builtin/assert-not-with-location", x_assert_not_with_location);
  define_primitive_3(mod, "meta-builtin/builtin/assert-equal-with-location", x_assert_equal_with_location);
  define_primitive_3(mod, "meta-builtin/builtin/assert-not-equal-with-location", x_assert_not_equal_with_location);

  // error

  define_primitive_1(mod, "meta-builtin/builtin/error", x_error);
  define_primitive_1(mod, "meta-builtin/builtin/错误", x_error);
  define_primitive_2(mod, "meta-builtin/builtin/error-with-location", x_error_with_location);
  define_primitive_2(mod, "meta-builtin/builtin/错误及位置", x_error_with_location);

  // sexp

  define_primitive_2(mod, "meta-builtin/builtin/parse-sexps", x_parse_sexps);
  define_primitive_2(mod, "meta-builtin/builtin/解析符号算式", x_parse_sexps);
  define_primitive_1(mod, "meta-builtin/builtin/format-as-sexp", x_format_as_sexp);
  define_primitive_1(mod, "meta-builtin/builtin/呈现为符号算式", x_format_as_sexp);
  define_primitive_2(mod, "meta-builtin/builtin/format-message-with-source-location", x_format_message_with_source_location);

  // json

  define_primitive_1(mod, "meta-builtin/builtin/parse-json", x_parse_json);
  define_primitive_1(mod, "meta-builtin/builtin/解析结森", x_parse_json);
  define_primitive_1(mod, "meta-builtin/builtin/format-json", x_format_json);
  define_primitive_1(mod, "meta-builtin/builtin/呈现结森", x_format_json);

  // fs

  define_primitive_1(mod, "meta-builtin/builtin/path-exists", x_path_exists);
  define_primitive_1(mod, "meta-builtin/builtin/路径存在", x_path_exists);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-file", x_path_is_file);
  define_primitive_1(mod, "meta-builtin/builtin/路径为文件", x_path_is_file);
  define_primitive_1(mod, "meta-builtin/builtin/path-is-directory", x_path_is_directory);
  define_primitive_1(mod, "meta-builtin/builtin/路径为目录", x_path_is_directory);
  define_primitive_1(mod, "meta-builtin/builtin/path-read", x_path_read);
  define_primitive_1(mod, "meta-builtin/builtin/路径读", x_path_read);
  define_primitive_2(mod, "meta-builtin/builtin/path-write", x_path_write);
  define_primitive_2(mod, "meta-builtin/builtin/路径写", x_path_write);
  define_primitive_1(mod, "meta-builtin/builtin/path-list", x_path_list);
  define_primitive_1(mod, "meta-builtin/builtin/路径列表", x_path_list);
  define_primitive_1(mod, "meta-builtin/builtin/path-list-recursive", x_path_list_recursive);
  define_primitive_1(mod, "meta-builtin/builtin/路径递归列表", x_path_list_recursive);
  define_primitive_1(mod, "meta-builtin/builtin/path-ensure-file", x_path_ensure_file);
  define_primitive_1(mod, "meta-builtin/builtin/路径确保文件", x_path_ensure_file);
  define_primitive_1(mod, "meta-builtin/builtin/path-ensure-directory", x_path_ensure_directory);
  define_primitive_1(mod, "meta-builtin/builtin/路径确保目录", x_path_ensure_directory);
  define_primitive_1(mod, "meta-builtin/builtin/path-delete-file", x_path_delete_file);
  define_primitive_1(mod, "meta-builtin/builtin/路径删除文件", x_path_delete_file);
  define_primitive_1(mod, "meta-builtin/builtin/path-delete-directory", x_path_delete_directory);
  define_primitive_1(mod, "meta-builtin/builtin/路径删除目录", x_path_delete_directory);
  define_primitive_1(mod, "meta-builtin/builtin/path-delete", x_path_delete);
  define_primitive_1(mod, "meta-builtin/builtin/路径删除", x_path_delete);
  define_primitive_2(mod, "meta-builtin/builtin/path-rename", x_path_rename);
  define_primitive_2(mod, "meta-builtin/builtin/路径重命名", x_path_rename);

  // closure

  define_primitive_2(mod, "meta-builtin/builtin/make-closure", x_make_closure);
  define_primitive_3(mod, "meta-builtin/builtin/closure-put-arg!", x_closure_put_arg_mut);
  define_primitive_2(mod, "meta-builtin/builtin/closure-arg", x_closure_arg);

  // process

  define_primitive_1(mod, "meta-builtin/builtin/exit", x_exit);
  define_primitive_1(mod, "meta-builtin/builtin/退出", x_exit);
  define_primitive_0(mod, "meta-builtin/builtin/current-directory", x_current_directory);
  define_primitive_0(mod, "meta-builtin/builtin/当前目录", x_current_directory);
  define_primitive_0(mod, "meta-builtin/builtin/current-command-line", x_current_command_line);
  define_primitive_0(mod, "meta-builtin/builtin/当前命令行", x_current_command_line);
  define_primitive_0(mod, "meta-builtin/builtin/current-full-command-line", x_current_full_command_line);
  define_primitive_0(mod, "meta-builtin/builtin/当前完整命令行", x_current_full_command_line);
  define_primitive_0(mod, "meta-builtin/builtin/current-stdout-file", x_current_stdout_file);
  define_primitive_0(mod, "meta-builtin/builtin/当前标准输出文件", x_current_stdout_file);
  define_primitive_0(mod, "meta-builtin/builtin/current-stderr-file", x_current_stderr_file);
  define_primitive_0(mod, "meta-builtin/builtin/当前标准错误文件", x_current_stderr_file);
}
