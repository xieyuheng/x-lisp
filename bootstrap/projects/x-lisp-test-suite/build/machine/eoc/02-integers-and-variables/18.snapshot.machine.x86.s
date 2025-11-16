
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₄)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₅)
        leaq x_random_dice(%rip), %rdi
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
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₄), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        movq $1, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₃)
        movq @(var _₃), %rdi
        movq @(var _₁₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₄)
        movq $1, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₆)
        movq @(var _₂), %rdi
        movq @(var _₁₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₇)
        movq $1, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₉)
        movq @(var _₁), %rdi
        movq @(var _₁₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
