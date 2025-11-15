
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        movq $32, @(var x₁)
        leaq _x_iadd(%rip), @(var _₂)
        movq $10, @(var x₂)
        movq @(var _₂), %rdi
        movq @(var x₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₃)
        movq @(var _₃), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₄)
        movq @(var _₁), %rdi
        movq @(var _₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
