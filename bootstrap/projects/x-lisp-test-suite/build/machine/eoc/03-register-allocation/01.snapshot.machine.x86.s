
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
        movq $8, @(var v₁)
        movq $336, @(var w₁)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        movq @(var v₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃)
        movq $56, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var x₁)
        movq @(var x₁), %rdi
        callq identity
        movq %rax, @(var y₁)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var w₁), %rsi
        callq x_apply_unary
        movq %rax, @(var z₁)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₇)
        movq @(var _₇), %rdi
        movq @(var z₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        leaq x_ineg(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₉)
        movq @(var _₉), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₈), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
