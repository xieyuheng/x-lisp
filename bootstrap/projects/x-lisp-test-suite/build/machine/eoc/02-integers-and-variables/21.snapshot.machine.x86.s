
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
        movq $48, @(var y₁)
        leaq x_ineg(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        movq $336, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var y₂)
        movq @(var y₂), %rdi
        callq identity
        movq %rax, @(var x₁)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₄)
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
