
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_iadd(%rip), @(var _₂)
        movq $20, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₄)
        leaq _x_iadd(%rip), @(var _₅)
        movq $11, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₇)
        movq $11, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₉)
        movq @(var _₄), %rdi
        movq @(var _₉), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
