
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        movq $160, @(var x₁)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃)
        movq $176, @(var x₂)
        movq @(var _₃), %rdi
        movq @(var x₂), %rsi
        callq x_apply_unary
        movq %rax, @(var y₁)
        movq @(var _₁), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
