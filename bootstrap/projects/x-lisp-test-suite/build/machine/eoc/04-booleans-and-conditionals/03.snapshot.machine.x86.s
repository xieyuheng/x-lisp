
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_equal_p(%rip), @(var _₄)
        leaq x_random_dice(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq nullary_apply
        movq %rax, @(var _₆)
        movq @(var _₄), %rdi
        movq @(var _₆), %rsi
        callq apply
        movq %rax, @(var _₇)
        movq $1, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq apply
        movq %rax, @(var _₉)
        cmpq @(var _₉), $1
        jmpe main.main.then₅
        jmp main.main.else₆
main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
main.main.then₂:
        movq $0, @(var _₂)
        jmp main.main.let_body₁
main.main.else₃:
        movq $42, @(var _₂)
        jmp main.main.let_body₁
main.main.let_body₄:
        cmpq @(var _₃), $1
        jmpe main.main.then₂
        jmp main.main.else₃
main.main.then₅:
        leaq x_equal_p(%rip), @(var _₁₀)
        leaq x_random_dice(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq nullary_apply
        movq %rax, @(var _₁₂)
        movq @(var _₁₀), %rdi
        movq @(var _₁₂), %rsi
        callq apply
        movq %rax, @(var _₁₃)
        movq $2, @(var _₁₄)
        movq @(var _₁₃), %rdi
        movq @(var _₁₄), %rsi
        callq apply
        movq %rax, @(var _₃)
        jmp main.main.let_body₄
main.main.else₆:
        movq $0, @(var _₃)
        jmp main.main.let_body₄

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
