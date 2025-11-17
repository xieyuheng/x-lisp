
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
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        leaq x_random_dice(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        movq @(var _₃), %rdi
        callq x_apply_nullary
        movq %rax, @(var _₄)
        movq @(var _₂), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        leaq x_random_dice(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        callq x_apply_nullary
        movq %rax, @(var _₇)
        movq @(var _₅), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        movq @(var _₁), %rdi
        movq @(var _₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
