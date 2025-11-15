
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_iadd(%rip), @(var _₂)
        leaq x_iadd(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₂), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        leaq x_iadd(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        movq $4, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₃)
        movq @(var _₈), %rdi
        movq @(var _₁₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₄)
        movq @(var _₁), %rdi
        movq @(var _₁₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
