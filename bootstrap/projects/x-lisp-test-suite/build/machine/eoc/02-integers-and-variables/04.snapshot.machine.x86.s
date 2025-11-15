
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var x₁)
        movq @(var x₁), %rdi
        callq _identity
        movq %rax, @(var y₁)
        movq @(var y₁), %rdi
        callq _identity
        movq %rax, @(var z₁)
        leaq _x_ineg(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var z₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
