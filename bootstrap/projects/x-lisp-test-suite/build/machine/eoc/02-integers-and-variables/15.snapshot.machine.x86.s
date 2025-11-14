
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $4, @(var x₂)
        leaq x_iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₂), %rsi
        callq apply
        movq %rax, @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq apply
        movq %rax, @(var x₁)
        leaq x_iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq apply
        movq %rax, @(var _₈)
        movq @(var _₁), %rdi
        movq @(var _₈), %rsi
        callq apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 

.extern x_identity
.extern x_same_p
.extern x_equal_p
.extern x_atom_p
.extern x_anything_p
.extern x_print
.extern x_println_non_void
.extern x_write
.extern x_newline
.extern x_bool_p
.extern x_not
.extern x_int_p
.extern x_int_positive_p
.extern x_int_non_negative_p
.extern x_int_non_zero_p
.extern x_ineg
.extern x_iadd
.extern x_isub
.extern x_imul
.extern x_idiv
.extern x_imod
.extern x_int_max
.extern x_int_min
.extern x_int_greater_p
.extern x_int_less_p
.extern x_int_greater_equal_p
.extern x_int_less_equal_p
.extern x_int_compare_ascending
.extern x_int_compare_descending
.extern x_float_p
.extern x_float_positive_p
.extern x_float_non_negative_p
.extern x_float_non_zero_p
.extern x_fneg
.extern x_fadd
.extern x_fsub
.extern x_fmul
.extern x_fdiv
.extern x_float_max
.extern x_float_min
.extern x_float_greater_p
.extern x_float_less_p
.extern x_float_greater_equal_p
.extern x_float_less_equal_p
.extern x_float_compare_ascending
.extern x_float_compare_descending
.extern x_make_curry
.extern x_curry_put_mut
.extern x_random_dice
.extern x_random_int
.extern x_random_float
