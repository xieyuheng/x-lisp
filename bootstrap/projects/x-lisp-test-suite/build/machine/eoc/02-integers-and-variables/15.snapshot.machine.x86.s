
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $4, @(var x₂)
        leaq x_iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var x₁)
        leaq x_iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        movq @(var _₁), %rdi
        movq @(var _₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
