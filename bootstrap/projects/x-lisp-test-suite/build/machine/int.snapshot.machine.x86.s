
.text
_square:
_square.entry:
        movq %rdi, @(var x)
        leaq x_imul(%rip), @(var _₁)
        movq @(var _₁), %rdi
        movq @(var x), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 

.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        leaq _square(%rip), @(var _₂)
        leaq _square(%rip), @(var _₃)
        movq $3, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₂), %rdi
        movq @(var _₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
