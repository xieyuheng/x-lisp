
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
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        movq $8, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        movq $16, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₂), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₉)
        movq $24, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        movq $32, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₃)
        movq @(var _₈), %rdi
        movq @(var _₁₃), %rsi
        callq x_apply_unary
        movq %rax, @(var x₁)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₄)
        movq @(var _₁₄), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₅)
        movq $40, @(var _₁₆)
        movq @(var _₁₅), %rdi
        movq @(var _₁₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₇)
        movq @(var _₁), %rdi
        movq @(var _₁₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
