
.text
main:
main.entry:
        leaq println_non_void(%rip), @(var _₁)
        leaq iadd(%rip), @(var _₂)
        leaq iadd(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq apply
        movq %rax, @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq apply
        movq %rax, @(var _₇)
        movq @(var _₂), %rdi
        movq @(var _₇), %rsi
        callq apply
        movq %rax, @(var _₈)
        leaq iadd(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq apply
        movq %rax, @(var _₁₁)
        movq $4, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq apply
        movq %rax, @(var _₁₃)
        movq @(var _₈), %rdi
        movq @(var _₁₃), %rsi
        callq apply
        movq %rax, @(var x₁)
        leaq iadd(%rip), @(var _₁₄)
        movq @(var _₁₄), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₁₅)
        movq $5, @(var _₁₆)
        movq @(var _₁₅), %rdi
        movq @(var _₁₆), %rsi
        callq apply
        movq %rax, @(var _₁₇)
        movq @(var _₁), %rdi
        movq @(var _₁₇), %rsi
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
