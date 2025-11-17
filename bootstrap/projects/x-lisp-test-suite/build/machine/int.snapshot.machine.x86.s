
.text
_square:
_square.entry:
        movq %rdi, @(var x)
        leaq x_imul(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
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
        leaq x_println_non_void(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        leaq _square(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        leaq _square(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        movq $24, @(var _₄)
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
