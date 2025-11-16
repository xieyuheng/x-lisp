
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
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₂), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₁₂)
        movq $4, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₄)
        movq $5, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₆)
        movq @(var _₁₁), %rdi
        movq @(var _₁₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₇)
        movq @(var _₈), %rdi
        movq @(var _₁₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₈)
        movq @(var _₁), %rdi
        movq @(var _₁₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
