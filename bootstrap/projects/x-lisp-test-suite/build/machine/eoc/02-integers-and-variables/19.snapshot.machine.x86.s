
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $1, @(var x₁)
        leaq x_iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃)
        movq $5, @(var x₃)
        leaq x_iadd(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var x₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₃), %rsi
        callq x_apply_unary
        movq %rax, @(var x₂)
        leaq x_iadd(%rip), @(var _₆)
        movq @(var _₆), %rdi
        movq @(var x₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq $100, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₉)
        movq @(var _₃), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
