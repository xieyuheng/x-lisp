#include "index.h"

void
import_builtin(mod_t *mod) {
    // int

    define_primitive_fn_1(mod, "int?", x_int_p);
    define_primitive_fn_1(mod, "ineg", x_ineg);
    define_primitive_fn_2(mod, "iadd", x_iadd);
    define_primitive_fn_2(mod, "isub", x_isub);
    define_primitive_fn_2(mod, "imul", x_imul);
    define_primitive_fn_2(mod, "idiv", x_idiv);
    define_primitive_fn_2(mod, "imod", x_imod);
    define_primitive_fn_2(mod, "int-max", x_int_max);
    define_primitive_fn_2(mod, "int-min", x_int_min);
    define_primitive_fn_2(mod, "int-greater?", x_int_greater_p);
    define_primitive_fn_2(mod, "int-less?", x_int_less_p);
    define_primitive_fn_2(mod, "int-greater-equal?", x_int_greater_equal_p);
    define_primitive_fn_2(mod, "int-less-equal?", x_int_less_equal_p);
    define_primitive_fn_1(mod, "int-positive?", x_int_positive_p);
    define_primitive_fn_1(mod, "int-non-negative?", x_int_non_negative_p);
    define_primitive_fn_1(mod, "int-non-zero?", x_int_non_zero_p);
    define_primitive_fn_2(mod, "int-compare-ascending", x_int_compare_ascending);
    define_primitive_fn_2(mod, "int-compare-descending", x_int_compare_descending);
    define_primitive_fn_1(mod, "int-to-float", x_int_to_float);
}
