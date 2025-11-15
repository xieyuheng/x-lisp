
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        movq $6, @(var y₁)
        leaq _x_ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var y₂)
        movq @(var y₂), %rdi
        callq _identity
        movq %rax, @(var x₁)
        leaq _x_iadd(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var y₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
