
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        leaq x_random_dice(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        callq x_apply_nullary
        movq %rax, @(var x₁)
        leaq x_random_dice(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        movq @(var _₃), %rdi
        callq x_apply_nullary
        movq %rax, @(var y₁)
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
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₄), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        movq $42, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
