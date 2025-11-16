
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₂)
        movq $20, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄)
        movq $22, @(var _₅)
        movq @(var _₄), %rdi
        movq @(var _₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
