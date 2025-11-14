
.text
main:
main.entry:
        leaq println_non_void(%rip), @(var _₁)
        leaq random_dice(%rip), @(var _₂)
        movq @(var _₂), %rdi
        callq nullary_apply
        movq %rax, @(var x₁)
        leaq random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq nullary_apply
        movq %rax, @(var y₁)
        leaq iadd(%rip), @(var _₄)
        leaq int_less_p(%rip), @(var _₇)
        movq @(var _₇), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₈)
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq apply
        movq %rax, @(var _₁₀)
        cmpq @(var _₁₀), $1
        jmpe main.main.then₁₁
        jmp main.main.else₁₂
main.main.let_body₁:
        movq @(var _₂₃), %rdi
        movq @(var _₂₄), %rsi
        callq apply
        movq %rax, @(var _₄₂)
        movq @(var _₁), %rdi
        movq @(var _₄₂), %rsi
        callq apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
main.main.then₂:
        leaq iadd(%rip), @(var _₃₆)
        movq @(var _₃₆), %rdi
        movq @(var y₁), %rsi
        callq apply
        movq %rax, @(var _₃₇)
        movq $2, @(var _₃₈)
        movq @(var _₃₇), %rdi
        movq @(var _₃₈), %rsi
        callq apply
        movq %rax, @(var _₂₄)
        jmp main.main.let_body₁
main.main.else₃:
        leaq iadd(%rip), @(var _₃₉)
        movq @(var _₃₉), %rdi
        movq @(var y₁), %rsi
        callq apply
        movq %rax, @(var _₄₀)
        movq $10, @(var _₄₁)
        movq @(var _₄₀), %rdi
        movq @(var _₄₁), %rsi
        callq apply
        movq %rax, @(var _₂₄)
        jmp main.main.let_body₁
main.main.let_body₄:
        cmpq @(var _₂₅), $1
        jmpe main.main.then₂
        jmp main.main.else₃
main.main.then₅:
        leaq equal_p(%rip), @(var _₃₀)
        movq @(var _₃₀), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₃₁)
        movq $0, @(var _₃₂)
        movq @(var _₃₁), %rdi
        movq @(var _₃₂), %rsi
        callq apply
        movq %rax, @(var _₂₅)
        jmp main.main.let_body₄
main.main.else₆:
        leaq equal_p(%rip), @(var _₃₃)
        movq @(var _₃₃), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₃₄)
        movq $2, @(var _₃₅)
        movq @(var _₃₄), %rdi
        movq @(var _₃₅), %rsi
        callq apply
        movq %rax, @(var _₂₅)
        jmp main.main.let_body₄
main.main.let_body₇:
        movq @(var _₄), %rdi
        movq @(var _₅), %rsi
        callq apply
        movq %rax, @(var _₂₃)
        leaq int_less_p(%rip), @(var _₂₆)
        movq @(var _₂₆), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq apply
        movq %rax, @(var _₂₉)
        cmpq @(var _₂₉), $1
        jmpe main.main.then₅
        jmp main.main.else₆
main.main.then₈:
        leaq iadd(%rip), @(var _₁₇)
        movq @(var _₁₇), %rdi
        movq @(var y₁), %rsi
        callq apply
        movq %rax, @(var _₁₈)
        movq $2, @(var _₁₉)
        movq @(var _₁₈), %rdi
        movq @(var _₁₉), %rsi
        callq apply
        movq %rax, @(var _₅)
        jmp main.main.let_body₇
main.main.else₉:
        leaq iadd(%rip), @(var _₂₀)
        movq @(var _₂₀), %rdi
        movq @(var y₁), %rsi
        callq apply
        movq %rax, @(var _₂₁)
        movq $10, @(var _₂₂)
        movq @(var _₂₁), %rdi
        movq @(var _₂₂), %rsi
        callq apply
        movq %rax, @(var _₅)
        jmp main.main.let_body₇
main.main.let_body₁₀:
        cmpq @(var _₆), $1
        jmpe main.main.then₈
        jmp main.main.else₉
main.main.then₁₁:
        leaq equal_p(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₁₂)
        movq $0, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq apply
        movq %rax, @(var _₆)
        jmp main.main.let_body₁₀
main.main.else₁₂:
        leaq equal_p(%rip), @(var _₁₄)
        movq @(var _₁₄), %rdi
        movq @(var x₁), %rsi
        callq apply
        movq %rax, @(var _₁₅)
        movq $2, @(var _₁₆)
        movq @(var _₁₅), %rdi
        movq @(var _₁₆), %rsi
        callq apply
        movq %rax, @(var _₆)
        jmp main.main.let_body₁₀

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
