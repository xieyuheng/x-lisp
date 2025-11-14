
.text
main:
main.entry:
        leaq println_non_void(%rip), @(var _₁)
        leaq print(%rip), @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq apply
        movq %rax, @(var _∅₁)
        leaq newline(%rip), @(var _₄)
        movq @(var _₄), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₂)
        leaq print(%rip), @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq apply
        movq %rax, @(var _∅₃)
        leaq newline(%rip), @(var _₇)
        movq @(var _₇), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₄)
        leaq print(%rip), @(var _₈)
        movq $3, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq apply
        movq %rax, @(var _∅₅)
        leaq newline(%rip), @(var _₁₀)
        movq @(var _₁₀), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₆)
        movq $6, @(var x₁)
        leaq print(%rip), @(var _₁₁)
        movq $4, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq apply
        movq %rax, @(var _∅₁)
        leaq newline(%rip), @(var _₁₃)
        movq @(var _₁₃), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₂)
        leaq print(%rip), @(var _₁₄)
        movq $5, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq apply
        movq %rax, @(var _∅₃)
        leaq newline(%rip), @(var _₁₆)
        movq @(var _₁₆), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₄)
        leaq print(%rip), @(var _₁₇)
        movq $6, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq apply
        movq %rax, @(var _∅₅)
        leaq newline(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₆)
        leaq iadd(%rip), @(var _₂₀)
        movq @(var _₂₀), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₂₁)
        movq @(var _₂₁), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₂₂)
        movq @(var _₁), %rdi
        movq @(var _₂₂), %rsi
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
