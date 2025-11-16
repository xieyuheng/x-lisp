
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁)
        movq $1, @(var x₁)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃)
        movq $5, @(var y₁)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₄)
        movq @(var _₄), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var x₂)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var x₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq $100, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₉)
        movq @(var _₃), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
