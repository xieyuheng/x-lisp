
.text
main:
main.entry:
        leaq println_non_void(%rip), @(var _₁)
        leaq equal_p(%rip), @(var _₄)
        leaq random_dice(%rip), @(var _₅)
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
        leaq equal_p(%rip), @(var _₁₀)
        leaq random_dice(%rip), @(var _₁₁)
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
