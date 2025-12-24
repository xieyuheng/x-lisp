#include "index.h"

void
import_builtin(mod_t *mod) {
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
    define_primitive_2(mod, "int-greater-equal?", x_int_greater_equal_p);
    define_primitive_2(mod, "int-less-equal?", x_int_less_equal_p);
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
    define_primitive_2(mod, "float-greater-equal?", x_float_greater_equal_p);
    define_primitive_2(mod, "float-less-equal?", x_float_less_equal_p);
    define_primitive_1(mod, "float-positive?", x_float_positive_p);
    define_primitive_1(mod, "float-non-negative?", x_float_non_negative_p);
    define_primitive_1(mod, "float-non-zero?", x_float_non_zero_p);
    define_primitive_2(mod, "float-compare-ascending", x_float_compare_ascending);
    define_primitive_2(mod, "float-compare-descending", x_float_compare_descending);
    define_primitive_1(mod, "float-to-int", x_float_to_int);

    // bool

    define_constant(mod, "true", x_true);
    define_constant(mod, "false", x_false);
    define_primitive_1(mod, "bool?", x_bool_p);
    define_primitive_1(mod, "not", x_not);

    // null

    define_constant(mod, "null", x_null);
    define_primitive_1(mod, "null?", x_null_p);

    // void

    define_constant(mod, "void", x_void);
    define_primitive_1(mod, "void?", x_void_p);

    // value

    define_primitive_1(mod, "anything?", x_anything_p);
    define_primitive_2(mod, "same?", x_same_p);
    define_primitive_2(mod, "equal?", x_equal_p);

    // console

    define_primitive_0(mod, "newline", x_newline);
    define_primitive_1(mod, "print", x_print);
    define_primitive_1(mod, "println", x_println);
    define_primitive_1(mod, "println-non-void", x_println_non_void);

    // syntax

    define_primitive(mod, "@const", x_define_constant);
    define_primitive(mod, "@var", x_define_variable);
    define_primitive(mod, "@def", x_define_function);
    define_primitive(mod, "@begin", x_begin);



    // list
    define_primitive_1(mod, "anything-list?", x_anything_list_p);
    define_primitive_0(mod, "make-list", x_make_list);
    define_primitive_1(mod, "list-copy", x_list_copy);
    define_primitive_1(mod, "list-length", x_list_length);
    define_primitive_1(mod, "list-empty?", x_list_empty_p);
    define_primitive_1(mod, "list-pop!", x_list_pop_mut);
    define_primitive_2(mod, "list-push!", x_list_push_mut);
    // define_primitive_2(mod, "list-push", x_list_push);
    define_primitive_1(mod, "list-shift!", x_list_shift_mut);
    define_primitive_2(mod, "list-unshift!", x_list_unshift_mut);
    define_primitive_2(mod, "list-get", x_list_get);
    define_primitive_3(mod, "list-put!", x_list_put_mut);
    // define_primitive_3(mod, "list-put", x_list_put);
    define_primitive_1(mod, "car", x_car);
    define_primitive_1(mod, "cdr", x_cdr);
    define_primitive_2(mod, "cons", x_cons);
    // (list-head list)
    // (list-tail list)
    // (list-init list)
    // (list-last list)
    // (list-reverse! list)
    // (list-reverse list)
}
