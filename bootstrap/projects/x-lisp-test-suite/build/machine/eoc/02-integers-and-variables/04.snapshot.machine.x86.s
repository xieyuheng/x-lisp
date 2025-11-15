
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq x_ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var x₁)
        movq @(var x₁), %rdi
        callq identity
        movq %rax, @(var y₁)
        movq @(var y₁), %rdi
        callq identity
        movq %rax, @(var z₁)
        leaq x_ineg(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var z₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
