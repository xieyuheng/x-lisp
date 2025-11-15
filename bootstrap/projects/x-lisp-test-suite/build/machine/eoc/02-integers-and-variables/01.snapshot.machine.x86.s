
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $4, @(var x₁)
        leaq x_iadd(%rip), @(var _₂)
        movq $8, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄)
        movq @(var _₄), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
