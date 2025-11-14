
.text
main:
main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $20, @(var x₁)
        movq $22, @(var z₁)
        leaq x_iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃)
        movq @(var _₃), %rdi
        movq @(var z₁), %rsi
        callq x_apply_unary
        movq %rax, @(var y₁)
        movq @(var _₁), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
