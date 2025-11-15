
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $6, @(var y₁)
        leaq x_ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var y₂)
        movq @(var y₂), %rdi
        callq identity
        movq %rax, @(var x₁)
        leaq x_iadd(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
