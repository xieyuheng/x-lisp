
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_iadd(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq apply
        movq %rax, @(var _₄)
        leaq x_ineg(%rip), @(var _₅)
        movq $10, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq apply
        movq %rax, @(var _₇)
        movq @(var _₄), %rdi
        movq @(var _₇), %rsi
        callq apply
        movq %rax, @(var x₁)
        leaq x_iadd(%rip), @(var _₈)
        movq @(var _₈), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₉)
        movq $10, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq apply
        movq %rax, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 

.extern identity
.extern same_p
.extern equal_p
.extern atom_p
.extern anything_p
.extern print
.extern println_non_void
.extern write
.extern newline
.extern bool_p
.extern not
.extern int_p
.extern int_positive_p
.extern int_non_negative_p
.extern int_non_zero_p
.extern ineg
.extern iadd
.extern isub
.extern imul
.extern idiv
.extern imod
.extern int_max
.extern int_min
.extern int_greater_p
.extern int_less_p
.extern int_greater_equal_p
.extern int_less_equal_p
.extern int_compare_ascending
.extern int_compare_descending
.extern float_p
.extern float_positive_p
.extern float_non_negative_p
.extern float_non_zero_p
.extern fneg
.extern fadd
.extern fsub
.extern fmul
.extern fdiv
.extern float_max
.extern float_min
.extern float_greater_p
.extern float_less_p
.extern float_greater_equal_p
.extern float_less_equal_p
.extern float_compare_ascending
.extern float_compare_descending
.extern make_curry
.extern curry_put_mut
.extern random_dice
.extern random_int
.extern random_float
