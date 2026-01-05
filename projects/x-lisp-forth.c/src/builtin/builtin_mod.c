#include "index.h"

mod_t *
make_builtin_mod(void) {
    path_t *path = make_path("builtin:");
    mod_t *mod = make_mod(path);

    // int

    define_primitive_1(mod, "int?", x_int_p);
    define_primitive_1(mod, "ineg", x_ineg);
    define_primitive_2(mod, "iadd", x_iadd);
    define_primitive_2(mod, "isub", x_isub);
    define_primitive_2(mod, "imul", x_imul);
    define_primitive_2(mod, "idiv", x_idiv);
    define_primitive_2(mod, "imod", x_imod);
    define_primitive_2(mod, "int-max", x_int_max);
    define_primitive_2(mod, "int-min", x_int_min);
    define_primitive_2(mod, "int-greater?", x_int_greater_p);
    define_primitive_2(mod, "int-less?", x_int_less_p);
    define_primitive_2(mod, "int-greater-or-equal?", x_int_greater_or_equal_p);
    define_primitive_2(mod, "int-less-or-equal?", x_int_less_or_equal_p);
    define_primitive_1(mod, "int-positive?", x_int_positive_p);
    define_primitive_1(mod, "int-non-negative?", x_int_non_negative_p);
    define_primitive_1(mod, "int-non-zero?", x_int_non_zero_p);
    define_primitive_2(mod, "int-compare-ascending", x_int_compare_ascending);
    define_primitive_2(mod, "int-compare-descending", x_int_compare_descending);
    define_primitive_1(mod, "int-to-float", x_int_to_float);

    // float

    define_primitive_1(mod, "float?", x_float_p);
    define_primitive_1(mod, "fneg", x_fneg);
    define_primitive_2(mod, "fadd", x_fadd);
    define_primitive_2(mod, "fsub", x_fsub);
    define_primitive_2(mod, "fmul", x_fmul);
    define_primitive_2(mod, "fdiv", x_fdiv);
    define_primitive_2(mod, "fmod", x_fmod);
    define_primitive_2(mod, "float-max", x_float_max);
    define_primitive_2(mod, "float-min", x_float_min);
    define_primitive_2(mod, "float-greater?", x_float_greater_p);
    define_primitive_2(mod, "float-less?", x_float_less_p);
    define_primitive_2(mod, "float-greater-or-equal?", x_float_greater_or_equal_p);
    define_primitive_2(mod, "float-less-or-equal?", x_float_less_or_equal_p);
    define_primitive_1(mod, "float-positive?", x_float_positive_p);
    define_primitive_1(mod, "float-non-negative?", x_float_non_negative_p);
    define_primitive_1(mod, "float-non-zero?", x_float_non_zero_p);
    define_primitive_2(mod, "float-compare-ascending", x_float_compare_ascending);
    define_primitive_2(mod, "float-compare-descending", x_float_compare_descending);
    define_primitive_1(mod, "float-to-int", x_float_to_int);

    // bool

    define_variable(mod, "true", x_true);
    define_variable(mod, "false", x_false);
    define_primitive_1(mod, "bool?", x_bool_p);
    define_primitive_1(mod, "not", x_not);

    // null

    define_variable(mod, "null", x_null);
    define_primitive_1(mod, "null?", x_null_p);

    // void

    define_variable(mod, "void", x_void);
    define_primitive_1(mod, "void?", x_void_p);

    // value

    define_primitive_1(mod, "any?", x_any_p);
    define_primitive_2(mod, "same?", x_same_p);
    define_primitive_2(mod, "equal?", x_equal_p);
    define_primitive_1(mod, "hash-code", x_hash_code);
    define_primitive_2(mod, "total-compare", x_total_compare);

    // console

    define_primitive_0(mod, "newline", x_newline);
    define_primitive_1(mod, "write", x_write);
    define_primitive_1(mod, "print", x_print);
    define_primitive_1(mod, "println", x_println);

    // system

    define_primitive_0(mod, "exit", x_exit);

    // random

    define_primitive_0(mod, "random-dice", x_random_dice);

    // hashtag

    define_primitive_1(mod, "hashtag?", x_hashtag_p);
    define_primitive_1(mod, "hashtag-length", x_hashtag_length);
    define_primitive_1(mod, "hashtag-to-string", x_hashtag_to_string);
    define_primitive_2(mod, "hashtag-append", x_hashtag_append);

    // symbol

    define_primitive_1(mod, "symbol?", x_symbol_p);
    define_primitive_1(mod, "symbol-length", x_symbol_length);
    define_primitive_1(mod, "symbol-to-string", x_symbol_to_string);
    define_primitive_2(mod, "symbol-append", x_symbol_append);

    // string

    define_primitive_1(mod, "string?", x_string_p);
    define_primitive_1(mod, "string-length", x_string_length);
    define_primitive_1(mod, "string-empty?", x_string_empty_p);
    define_primitive_2(mod, "string-append", x_string_append);
    // (string-concat list)
    // (string-join separator list)
    // (string-chars string)
    // (string-compare-lexical x y)
    // (string-to-symbol string)

    // list

    define_primitive_0(mod, "make-list", x_make_list);
    define_primitive_1(mod, "any-list?", x_any_list_p);
    define_primitive_1(mod, "list-copy", x_list_copy);
    define_primitive_1(mod, "list-length", x_list_length);
    define_primitive_1(mod, "list-empty?", x_list_empty_p);
    define_primitive_1(mod, "list-pop!", x_list_pop_mut);
    define_primitive_2(mod, "list-push!", x_list_push_mut);
    define_primitive_2(mod, "list-push", x_list_push);
    define_primitive_1(mod, "list-shift!", x_list_shift_mut);
    define_primitive_2(mod, "list-unshift!", x_list_unshift_mut);
    define_primitive_2(mod, "list-get", x_list_get);
    define_primitive_3(mod, "list-put!", x_list_put_mut);
    define_primitive_3(mod, "list-put", x_list_put);
    define_primitive_1(mod, "car", x_car);
    define_primitive_1(mod, "cdr", x_cdr);
    define_primitive_2(mod, "cons", x_cons);
    define_primitive_1(mod, "list-head", x_list_head);
    define_primitive_1(mod, "list-tail", x_list_tail);
    define_primitive_1(mod, "list-init", x_list_init);
    define_primitive_1(mod, "list-last", x_list_last);
    define_primitive_1(mod, "list-reverse!", x_list_reverse_mut);
    define_primitive_1(mod, "list-reverse", x_list_reverse);

    // record

    define_primitive_0(mod, "make-record", x_make_record);
    define_primitive_1(mod, "any-record?", x_any_record_p);
    define_primitive_1(mod, "record-copy", x_record_copy);
    define_primitive_1(mod, "record-length", x_record_length);
    define_primitive_1(mod, "record-empty?", x_record_empty_p);
    define_primitive_2(mod, "record-get", x_record_get);
    define_primitive_2(mod, "record-has?", x_record_has_p);
    define_primitive_3(mod, "record-put!", x_record_put_mut);
    define_primitive_3(mod, "record-put", x_record_put);
    define_primitive_2(mod, "record-delete!", x_record_delete_mut);
    define_primitive_2(mod, "record-delete", x_record_delete);
    define_primitive_2(mod, "record-append", x_record_append);
    define_primitive_1(mod, "record-keys", x_record_keys);
    define_primitive_1(mod, "record-values", x_record_values);
    define_primitive_1(mod, "record-entries", x_record_entries);

    // hash

    define_primitive_0(mod, "make-hash", x_make_hash);
    define_primitive_1(mod, "any-hash?", x_any_hash_p);
    define_primitive_1(mod, "hash-copy", x_hash_copy);
    define_primitive_1(mod, "hash-length", x_hash_length);
    define_primitive_1(mod, "hash-empty?", x_hash_empty_p);
    define_primitive_2(mod, "hash-get", x_hash_get);
    define_primitive_2(mod, "hash-has?", x_hash_has_p);
    define_primitive_3(mod, "hash-put!", x_hash_put_mut);
    define_primitive_3(mod, "hash-put", x_hash_put);
    define_primitive_2(mod, "hash-delete!", x_hash_delete_mut);
    define_primitive_2(mod, "hash-delete", x_hash_delete);
    define_primitive_1(mod, "hash-keys", x_hash_keys);
    define_primitive_1(mod, "hash-values", x_hash_values);
    define_primitive_1(mod, "hash-entries", x_hash_entries);

    // set

    define_primitive_0(mod, "make-set", x_make_set);
    define_primitive_1(mod, "any-set?", x_any_set_p);
    define_primitive_1(mod, "set-copy", x_set_copy);
    define_primitive_1(mod, "set-size", x_set_size);
    define_primitive_1(mod, "set-empty?", x_set_empty_p);
    define_primitive_2(mod, "set-member?", x_set_member_p);
    define_primitive_2(mod, "set-add!", x_set_add_mut);
    define_primitive_2(mod, "set-add", x_set_add);
    define_primitive_2(mod, "set-delete!", x_set_delete_mut);
    define_primitive_2(mod, "set-delete", x_set_delete);
    define_primitive_1(mod, "set-clear!", x_set_clear_mut);
    define_primitive_2(mod, "set-union", x_set_union);
    define_primitive_2(mod, "set-inter", x_set_inter);
    define_primitive_2(mod, "set-difference", x_set_difference);
    define_primitive_2(mod, "set-subset?", x_set_subset_p);
    define_primitive_2(mod, "set-disjoint?", x_set_disjoint_p);
    define_primitive_1(mod, "set-to-list", x_set_to_list);

    return mod;
}

static mod_t *global_builtin_mod = NULL;

void
import_builtin_mod(mod_t *mod) {
    if (!global_builtin_mod) {
        global_builtin_mod = make_builtin_mod();
    }

    record_iter_t iter;
    record_iter_init(&iter, global_builtin_mod->definitions);
    definition_t *definition = record_iter_next_value(&iter);
    while (definition) {
        mod_define(mod, definition->name, definition);
        definition = record_iter_next_value(&iter);
    }
}
