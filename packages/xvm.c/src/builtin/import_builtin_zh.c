#include "index.h"

void import_builtin_zh(mod_t *mod) {
  // int

  define_primitive_1(mod, "meta-builtin/内置/为整数", x_is_int);
  define_primitive_1(mod, "meta-builtin/内置/整数负", x_ineg);
  define_primitive_2(mod, "meta-builtin/内置/整数加", x_iadd);
  define_primitive_2(mod, "meta-builtin/内置/整数减", x_isub);
  define_primitive_2(mod, "meta-builtin/内置/整数乘", x_imul);
  define_primitive_2(mod, "meta-builtin/内置/整数除", x_idiv);
  define_primitive_2(mod, "meta-builtin/内置/整数模", x_imod);
  define_primitive_2(mod, "meta-builtin/内置/整数最大", x_int_max);
  define_primitive_2(mod, "meta-builtin/内置/整数最小", x_int_min);
  define_primitive_2(mod, "meta-builtin/内置/整数大于", x_int_greater);
  define_primitive_2(mod, "meta-builtin/内置/整数小于", x_int_less);
  define_primitive_2(mod, "meta-builtin/内置/整数大于等于", x_int_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/内置/整数小于等于", x_int_less_or_equal);
  define_primitive_1(mod, "meta-builtin/内置/整数为正", x_int_positive);
  define_primitive_1(mod, "meta-builtin/内置/整数为非负", x_int_non_negative);
  define_primitive_1(mod, "meta-builtin/内置/整数为非零", x_int_non_zero);
  define_primitive_2(mod, "meta-builtin/内置/整数升序比较", x_int_compare_ascending);
  define_primitive_2(mod, "meta-builtin/内置/整数降序比较", x_int_compare_descending);
  define_primitive_1(mod, "meta-builtin/内置/整数转浮点", x_int_to_float);

  // float

  define_primitive_1(mod, "meta-builtin/内置/为浮点", x_is_float);
  define_primitive_1(mod, "meta-builtin/内置/浮点负", x_fneg);
  define_primitive_2(mod, "meta-builtin/内置/浮点加", x_fadd);
  define_primitive_2(mod, "meta-builtin/内置/浮点减", x_fsub);
  define_primitive_2(mod, "meta-builtin/内置/浮点乘", x_fmul);
  define_primitive_2(mod, "meta-builtin/内置/浮点除", x_fdiv);
  define_primitive_2(mod, "meta-builtin/内置/浮点模", x_fmod);
  define_primitive_2(mod, "meta-builtin/内置/浮点最大", x_float_max);
  define_primitive_2(mod, "meta-builtin/内置/浮点最小", x_float_min);
  define_primitive_2(mod, "meta-builtin/内置/浮点大于", x_float_greater);
  define_primitive_2(mod, "meta-builtin/内置/浮点小于", x_float_less);
  define_primitive_2(mod, "meta-builtin/内置/浮点大于等于", x_float_greater_or_equal);
  define_primitive_2(mod, "meta-builtin/内置/浮点小于等于", x_float_less_or_equal);
  define_primitive_1(mod, "meta-builtin/内置/浮点为正", x_float_positive);
  define_primitive_1(mod, "meta-builtin/内置/浮点为非负", x_float_non_negative);
  define_primitive_1(mod, "meta-builtin/内置/浮点为非零", x_float_non_zero);
  define_primitive_2(mod, "meta-builtin/内置/浮点升序比较", x_float_compare_ascending);
  define_primitive_2(mod, "meta-builtin/内置/浮点降序比较", x_float_compare_descending);
  define_primitive_1(mod, "meta-builtin/内置/浮点转整数", x_float_to_int);

  // bool

  define_variable(mod, "meta-builtin/内置/真", x_true);
  define_variable(mod, "meta-builtin/内置/假", x_false);
  define_primitive_1(mod, "meta-builtin/内置/为真假", x_is_bool);
  define_primitive_1(mod, "meta-builtin/内置/非", x_not);

  // void

  define_variable(mod, "meta-builtin/内置/空", x_void);
  define_primitive_1(mod, "meta-builtin/内置/为空", x_is_void);

  // type

  define_variable_primitive_0(mod, "meta-builtin/内置/类型型", x_type_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/任意型", x_any_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/整数型", x_int_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/浮点型", x_float_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/文本型", x_string_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/符号型", x_symbol_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/标签型", x_keyword_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/真假型", x_bool_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/空型", x_void_t);
  define_variable_primitive_0(mod, "meta-builtin/内置/文件型", x_file_t);
  define_primitive_1(mod, "meta-builtin/内置/列表型", x_list_t);
  define_primitive_1(mod, "meta-builtin/内置/集合型", x_set_t);
  define_primitive_2(mod, "meta-builtin/内置/散列型", x_hash_t);
  define_primitive_2(mod, "meta-builtin/内置/序对型", x_pair_t);

  // value

  define_primitive_1(mod, "meta-builtin/内置/为原子", x_is_atom);
  define_primitive_2(mod, "meta-builtin/内置/相同", x_same);
  define_primitive_2(mod, "meta-builtin/内置/相等", x_equal);
  define_primitive_1(mod, "meta-builtin/内置/呈现", x_format);
  define_primitive_1(mod, "meta-builtin/内置/散列码", x_hash_code);
  define_primitive_2(mod, "meta-builtin/内置/全序比较", x_total_compare);

  // file

  define_primitive_1(mod, "meta-builtin/内置/打开输入文件", x_open_input_file);
  define_primitive_1(mod, "meta-builtin/内置/打开输出文件", x_open_output_file);
  define_primitive_1(mod, "meta-builtin/内置/文件关闭", x_file_close);
  define_primitive_1(mod, "meta-builtin/内置/文件读", x_file_read);
  define_primitive_2(mod, "meta-builtin/内置/文件写", x_file_write);
  define_primitive_2(mod, "meta-builtin/内置/文件写行", x_file_writeln);
  define_primitive_1(mod, "meta-builtin/内置/打印", x_print);
  define_primitive_1(mod, "meta-builtin/内置/打印行", x_println);

  // path

  define_primitive_1(mod, "meta-builtin/内置/路径文件名", x_path_base_name);
  define_primitive_1(mod, "meta-builtin/内置/路径目录名", x_path_directory_name);
  define_primitive_1(mod, "meta-builtin/内置/路径扩展名", x_path_extension);
  define_primitive_1(mod, "meta-builtin/内置/路径主干", x_path_stem);
  define_primitive_1(mod, "meta-builtin/内置/路径为绝对", x_path_is_absolute);
  define_primitive_1(mod, "meta-builtin/内置/路径为相对", x_path_is_relative);
  define_primitive_2(mod, "meta-builtin/内置/路径连接", x_path_join);
  define_primitive_1(mod, "meta-builtin/内置/路径规范化", x_path_normalize);
  define_primitive_2(mod, "meta-builtin/内置/路径相对", x_path_relative);
  define_primitive_1(mod, "meta-builtin/内置/路径相对于当前目录", x_path_relative_to_cwd);
  define_primitive_1(mod, "meta-builtin/内置/路径解析", x_path_resolve);

  // random

  define_primitive_2(mod, "meta-builtin/内置/随机整数", x_random_int);
  define_primitive_2(mod, "meta-builtin/内置/随机浮点", x_random_float);

  // keyword

  define_primitive_1(mod, "meta-builtin/内置/为标签", x_is_keyword);
  define_primitive_1(mod, "meta-builtin/内置/标签长度", x_keyword_length);
  define_primitive_1(mod, "meta-builtin/内置/标签转文本", x_keyword_to_string);
  define_primitive_2(mod, "meta-builtin/内置/标签追加", x_keyword_append);
  define_primitive_1(mod, "meta-builtin/内置/标签拼接", x_keyword_concat);

  // symbol

  define_primitive_1(mod, "meta-builtin/内置/为符号", x_is_symbol);
  define_primitive_1(mod, "meta-builtin/内置/符号长度", x_symbol_length);
  define_primitive_1(mod, "meta-builtin/内置/符号转文本", x_symbol_to_string);
  define_primitive_2(mod, "meta-builtin/内置/符号追加", x_symbol_append);
  define_primitive_1(mod, "meta-builtin/内置/符号拼接", x_symbol_concat);

  // string

  define_primitive_1(mod, "meta-builtin/内置/为文本", x_is_string);
  define_primitive_1(mod, "meta-builtin/内置/文本长度", x_string_length);
  define_primitive_1(mod, "meta-builtin/内置/文本为空", x_string_is_empty);
  define_primitive_1(mod, "meta-builtin/内置/文本为空白", x_string_is_blank);
  define_primitive_3(mod, "meta-builtin/内置/文本截段", x_string_substring);
  define_primitive_2(mod, "meta-builtin/内置/文本追加", x_string_append);
  define_primitive_1(mod, "meta-builtin/内置/文本拼接", x_string_concat);
  define_primitive_2(mod, "meta-builtin/内置/文本字典序比较", x_string_compare_lexical);
  define_primitive_1(mod, "meta-builtin/内置/文本转符号", x_string_to_symbol);
  define_primitive_1(mod, "meta-builtin/内置/文本字符", x_string_chars);
  define_primitive_1(mod, "meta-builtin/内置/文本行", x_string_lines);
  define_primitive_2(mod, "meta-builtin/内置/文本分割", x_string_split);
  define_primitive_2(mod, "meta-builtin/内置/文本连接", x_string_join);
  define_primitive_3(mod, "meta-builtin/内置/文本替换", x_string_replace);
  define_primitive_2(mod, "meta-builtin/内置/文本起首", x_string_starts_with);
  define_primitive_2(mod, "meta-builtin/内置/文本结尾", x_string_ends_with);
  define_primitive_1(mod, "meta-builtin/内置/文本转大写", x_string_to_upper_case);
  define_primitive_1(mod, "meta-builtin/内置/文本转小写", x_string_to_lower_case);
  define_primitive_2(mod, "meta-builtin/内置/文本取码点", x_string_get_code_point);
  define_primitive_2(mod, "meta-builtin/内置/文本包含", x_string_contains);
  define_primitive_2(mod, "meta-builtin/内置/文本查找索引", x_string_find_index);
  define_primitive_1(mod, "meta-builtin/内置/文本修剪左", x_string_trim_left);
  define_primitive_1(mod, "meta-builtin/内置/文本修剪右", x_string_trim_right);
  define_primitive_1(mod, "meta-builtin/内置/文本修剪首", x_string_trim_start);
  define_primitive_1(mod, "meta-builtin/内置/文本修剪尾", x_string_trim_end);
  define_primitive_1(mod, "meta-builtin/内置/文本修剪", x_string_trim);
  define_primitive_1(mod, "meta-builtin/内置/文本为整数", x_string_is_int);
  define_primitive_1(mod, "meta-builtin/内置/文本为浮点", x_string_is_float);
  define_primitive_1(mod, "meta-builtin/内置/文本转整数", x_string_to_int);
  define_primitive_1(mod, "meta-builtin/内置/文本转浮点", x_string_to_float);

  // list

  define_primitive_0(mod, "meta-builtin/内置/作列表", x_make_list);
  define_primitive_1(mod, "meta-builtin/内置/为列表", x_is_any_list);
  define_primitive_1(mod, "meta-builtin/内置/列表复制", x_list_copy);
  define_primitive_1(mod, "meta-builtin/内置/列表长度", x_list_length);
  define_primitive_1(mod, "meta-builtin/内置/列表为空", x_list_is_empty);
  define_primitive_1(mod, "meta-builtin/内置/列表末出", x_list_pop_mut);
  define_primitive_2(mod, "meta-builtin/内置/列表末入", x_list_push_mut);
  define_primitive_1(mod, "meta-builtin/内置/列表首出", x_list_pop_front_mut);
  define_primitive_2(mod, "meta-builtin/内置/列表首入", x_list_push_front_mut);
  define_primitive_2(mod, "meta-builtin/内置/列表取", x_list_get);
  define_primitive_3(mod, "meta-builtin/内置/列表存", x_list_put_mut);
  define_primitive_3(mod, "meta-builtin/内置/列表复制存", x_list_put);
  define_primitive_1(mod, "meta-builtin/内置/首", x_car);
  define_primitive_1(mod, "meta-builtin/内置/余", x_cdr);
  define_primitive_2(mod, "meta-builtin/内置/添", x_cons);
  define_primitive_1(mod, "meta-builtin/内置/列表首项", x_list_head);
  define_primitive_1(mod, "meta-builtin/内置/列表去首", x_list_rest);
  define_primitive_1(mod, "meta-builtin/内置/列表去末", x_list_but_last);
  define_primitive_1(mod, "meta-builtin/内置/列表末项", x_list_last);
  define_primitive_1(mod, "meta-builtin/内置/列表反转", x_list_reverse_mut);
  define_primitive_1(mod, "meta-builtin/内置/列表复制反转", x_list_reverse);
  define_primitive_1(mod, "meta-builtin/内置/列表转集合", x_list_to_set);

  // pair

  define_primitive_2(mod, "meta-builtin/内置/作序对", x_make_pair);
  define_primitive_1(mod, "meta-builtin/内置/序对前项", x_pair_first);
  define_primitive_1(mod, "meta-builtin/内置/序对后项", x_pair_second);
  define_primitive_2(mod, "meta-builtin/内置/序对存前项", x_pair_put_first);
  define_primitive_2(mod, "meta-builtin/内置/序对存后项", x_pair_put_second);

  // hash

  define_primitive_0(mod, "meta-builtin/内置/作散列", x_make_hash);
  define_primitive_1(mod, "meta-builtin/内置/为散列", x_is_any_hash);
  define_primitive_1(mod, "meta-builtin/内置/散列复制", x_hash_copy);
  define_primitive_1(mod, "meta-builtin/内置/散列长度", x_hash_length);
  define_primitive_1(mod, "meta-builtin/内置/散列为空", x_hash_is_empty);
  define_primitive_2(mod, "meta-builtin/内置/散列取", x_hash_get);
  define_primitive_2(mod, "meta-builtin/内置/散列有", x_hash_has);
  define_primitive_3(mod, "meta-builtin/内置/散列存", x_hash_put_mut);
  define_primitive_3(mod, "meta-builtin/内置/散列复制存", x_hash_put);
  define_primitive_2(mod, "meta-builtin/内置/散列删除", x_hash_delete_mut);
  define_primitive_1(mod, "meta-builtin/内置/散列键", x_hash_keys);
  define_primitive_1(mod, "meta-builtin/内置/散列值", x_hash_values);
  define_primitive_1(mod, "meta-builtin/内置/散列条目", x_hash_entries);

  // set

  define_primitive_0(mod, "meta-builtin/内置/作集合", x_make_set);
  define_primitive_1(mod, "meta-builtin/内置/为集合", x_is_any_set);
  define_primitive_1(mod, "meta-builtin/内置/集合复制", x_set_copy);
  define_primitive_1(mod, "meta-builtin/内置/集合大小", x_set_size);
  define_primitive_1(mod, "meta-builtin/内置/集合为空", x_set_is_empty);
  define_primitive_2(mod, "meta-builtin/内置/集合属于", x_set_member);
  define_primitive_2(mod, "meta-builtin/内置/集合添加", x_set_add_mut);
  define_primitive_2(mod, "meta-builtin/内置/集合复制添加", x_set_add);
  define_primitive_2(mod, "meta-builtin/内置/集合删除", x_set_delete_mut);
  define_primitive_2(mod, "meta-builtin/内置/集合复制删除", x_set_delete);
  define_primitive_1(mod, "meta-builtin/内置/集合清空", x_set_clear_mut);
  define_primitive_2(mod, "meta-builtin/内置/集合并", x_set_union);
  define_primitive_2(mod, "meta-builtin/内置/集合交", x_set_inter);
  define_primitive_2(mod, "meta-builtin/内置/集合差", x_set_difference);
  define_primitive_2(mod, "meta-builtin/内置/集合子集", x_set_subset);
  define_primitive_2(mod, "meta-builtin/内置/集合不交", x_set_disjoint);
  define_primitive_1(mod, "meta-builtin/内置/集合转列表", x_set_to_list);

  // assert

  define_primitive_1(mod, "meta-builtin/内置/断言", x_assert);
  define_primitive_1(mod, "meta-builtin/内置/断言非", x_assert_not);
  define_primitive_2(mod, "meta-builtin/内置/断言相等", x_assert_equal);
  define_primitive_2(mod, "meta-builtin/内置/断言不等", x_assert_not_equal);
  define_primitive_2(mod, "meta-builtin/内置/定位断言", x_assert_with_location);
  define_primitive_2(mod, "meta-builtin/内置/定位断言非", x_assert_not_with_location);
  define_primitive_3(mod, "meta-builtin/内置/定位断言相等", x_assert_equal_with_location);
  define_primitive_3(mod, "meta-builtin/内置/定位断言不等", x_assert_not_equal_with_location);

  // error

  define_primitive_1(mod, "meta-builtin/内置/报错", x_error);
  define_primitive_2(mod, "meta-builtin/内置/定位报错", x_error_with_location);

  // sexp

  define_primitive_2(mod, "meta-builtin/内置/解析符号算式", x_parse_sexps_zh);
  define_primitive_1(mod, "meta-builtin/内置/呈现为符号算式", x_format_as_sexp);
  define_primitive_2(mod, "meta-builtin/内置/呈现定位消息", x_format_message_with_location);

  // json

  define_primitive_1(mod, "meta-builtin/内置/解析结森", x_parse_json_zh);
  define_primitive_1(mod, "meta-builtin/内置/呈现结森", x_format_json_zh);

  // fs

  define_primitive_1(mod, "meta-builtin/内置/路径存在", x_path_exists);
  define_primitive_1(mod, "meta-builtin/内置/路径为文件", x_path_is_file);
  define_primitive_1(mod, "meta-builtin/内置/路径为目录", x_path_is_directory);
  define_primitive_1(mod, "meta-builtin/内置/路径读", x_path_read);
  define_primitive_2(mod, "meta-builtin/内置/路径写", x_path_write);
  define_primitive_1(mod, "meta-builtin/内置/路径列表", x_path_list);
  define_primitive_1(mod, "meta-builtin/内置/路径递归列表", x_path_list_recursive);
  define_primitive_1(mod, "meta-builtin/内置/路径确保文件", x_path_ensure_file);
  define_primitive_1(mod, "meta-builtin/内置/路径确保目录", x_path_ensure_directory);
  define_primitive_1(mod, "meta-builtin/内置/路径删除文件", x_path_delete_file);
  define_primitive_1(mod, "meta-builtin/内置/路径删除目录", x_path_delete_directory);
  define_primitive_1(mod, "meta-builtin/内置/路径删除", x_path_delete);
  define_primitive_2(mod, "meta-builtin/内置/路径重命名", x_path_rename);

  // closure

  define_primitive_2(mod, "meta-builtin/内置/作闭包", x_make_closure);
  define_primitive_3(mod, "meta-builtin/内置/闭包存参", x_closure_put_arg_mut);
  define_primitive_2(mod, "meta-builtin/内置/闭包取参", x_closure_arg);

  // process

  define_primitive_1(mod, "meta-builtin/内置/退出", x_exit);
  define_primitive_0(mod, "meta-builtin/内置/当前目录", x_current_directory);
  define_primitive_0(mod, "meta-builtin/内置/当前命令行", x_current_command_line);
  define_primitive_0(mod, "meta-builtin/内置/当前完整命令行", x_current_full_command_line);
  define_primitive_0(mod, "meta-builtin/内置/当前标准输出文件", x_current_stdout_file);
  define_primitive_0(mod, "meta-builtin/内置/当前标准错误文件", x_current_stderr_file);
}
