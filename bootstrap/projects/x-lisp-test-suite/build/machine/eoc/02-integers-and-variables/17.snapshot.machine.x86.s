
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_iadd(%rip), @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄)
        leaq x_iadd(%rip), @(var _₅)
        leaq x_random_dice(%rip), @(var _₆)
        movq @(var _₆), %rdi
        callq x_apply_nullary
        movq %rax, @(var _₇)
        movq @(var _₅), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₄), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
