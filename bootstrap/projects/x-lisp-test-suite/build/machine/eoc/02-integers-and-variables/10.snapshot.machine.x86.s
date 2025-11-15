
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_iadd(%rip), @(var _₂)
        leaq _x_iadd(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₂), %rdi
        movq @(var _₇), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₈)
        leaq _x_iadd(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₁)
        movq $4, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₃)
        movq @(var _₈), %rdi
        movq @(var _₁₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var x₁)
        leaq _x_iadd(%rip), @(var _₁₄)
        movq @(var _₁₄), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₅)
        movq $5, @(var _₁₆)
        movq @(var _₁₅), %rdi
        movq @(var _₁₆), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₇)
        movq @(var _₁), %rdi
        movq @(var _₁₇), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
