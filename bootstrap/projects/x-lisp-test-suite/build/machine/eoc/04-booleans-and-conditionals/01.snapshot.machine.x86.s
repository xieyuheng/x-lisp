
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_random_dice(%rip), @(var _₂)
        movq @(var _₂), %rdi
        callq nullary_apply
        movq %rax, @(var x₁)
        leaq x_random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq nullary_apply
        movq %rax, @(var y₁)
        leaq x_int_less_p(%rip), @(var _₆)
        movq @(var _₆), %rdi
        movq @(var x₁), %rsi
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
        movq @(var _₄), %rsi
        callq apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
main.main.then₂:
        leaq x_iadd(%rip), @(var _₁₆)
        movq @(var _₁₆), %rdi
        movq @(var y₁), %rsi
        callq apply
        movq %rax, @(var _₁₇)
        movq $2, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq apply
        movq %rax, @(var _₄)
        jmp main.main.let_body₁
main.main.else₃:
        leaq x_iadd(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        movq @(var y₁), %rsi
        callq apply
        movq %rax, @(var _₂₀)
        movq $10, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq apply
        movq %rax, @(var _₄)
        jmp main.main.let_body₁
main.main.let_body₄:
        cmpq @(var _₅), $1
        jmpe main.main.then₂
        jmp main.main.else₃
main.main.then₅:
        leaq x_equal_p(%rip), @(var _₁₀)
        movq @(var _₁₀), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₁₁)
        movq $0, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq apply
        movq %rax, @(var _₅)
        jmp main.main.let_body₄
main.main.else₆:
        leaq x_equal_p(%rip), @(var _₁₃)
        movq @(var _₁₃), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq apply
        movq %rax, @(var _₅)
        jmp main.main.let_body₄

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
