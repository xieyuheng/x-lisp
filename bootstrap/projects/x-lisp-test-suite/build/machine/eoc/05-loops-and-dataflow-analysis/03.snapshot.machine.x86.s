
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_print(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq apply
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₂)
        leaq x_print(%rip), @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq apply
        movq %rax, @(var _∅₃)
        leaq x_newline(%rip), @(var _₈)
        movq @(var _₈), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₄)
        leaq x_print(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq apply
        movq %rax, @(var _∅₅)
        leaq x_newline(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₆)
        leaq x_equal_p(%rip), @(var _₁₂)
        movq $1, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq apply
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq apply
        movq %rax, @(var _₁₆)
        cmpq @(var _₁₆), $1
        jmpe main.main.then₂
        jmp main.main.else₃
main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
main.main.then₂:
        leaq x_print(%rip), @(var _₁₇)
        movq $111, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq apply
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₂)
        leaq x_equal_p(%rip), @(var _₂₀)
        movq $1, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq apply
        movq %rax, @(var _₂₂)
        movq $2, @(var _₂₃)
        movq @(var _₂₂), %rdi
        movq @(var _₂₃), %rsi
        callq apply
        movq %rax, @(var _₂)
        jmp main.main.let_body₁
main.main.else₃:
        leaq x_print(%rip), @(var _₂₄)
        movq $222, @(var _₂₅)
        movq @(var _₂₄), %rdi
        movq @(var _₂₅), %rsi
        callq apply
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), @(var _₂₆)
        movq @(var _₂₆), %rdi
        callq nullary_apply
        movq %rax, @(var _∅₂)
        leaq x_equal_p(%rip), @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq apply
        movq %rax, @(var _₂₉)
        movq $2, @(var _₃₀)
        movq @(var _₂₉), %rdi
        movq @(var _₃₀), %rsi
        callq apply
        movq %rax, @(var _₂)
        jmp main.main.let_body₁

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
