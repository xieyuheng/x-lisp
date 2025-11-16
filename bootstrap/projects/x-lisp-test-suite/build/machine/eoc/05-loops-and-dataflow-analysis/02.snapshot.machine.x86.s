
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        callq x_make_function
        movq %rax, @(var _₄)
        movq @(var _₄), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₃)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        callq x_make_function
        movq %rax, @(var _₇)
        movq @(var _₇), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₄)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₈)
        movq $3, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₅)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        callq x_make_function
        movq %rax, @(var _₁₀)
        movq @(var _₁₀), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₆)
        movq $6, @(var x₁)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁₁)
        movq $4, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        callq x_make_function
        movq %rax, @(var _₁₃)
        movq @(var _₁₃), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁₄)
        movq $5, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₃)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        callq x_make_function
        movq %rax, @(var _₁₆)
        movq @(var _₁₆), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₄)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        callq x_make_function
        movq %rax, @(var _₁₇)
        movq $6, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₅)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        callq x_make_function
        movq %rax, @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₆)
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        callq x_make_function
        movq %rax, @(var _₂₀)
        movq @(var _₂₀), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₁)
        movq @(var _₂₁), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₂)
        movq @(var _₁), %rdi
        movq @(var _₂₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
