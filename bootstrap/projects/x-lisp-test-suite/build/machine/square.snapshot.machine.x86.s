
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁)
        leaq _§₁.square(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₂)
        leaq _§₁.square(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₃)
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

.text
_§₁.square:
_§₁.square.entry:
        movq %rdi, @(var x)
        leaq x_imul(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
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
