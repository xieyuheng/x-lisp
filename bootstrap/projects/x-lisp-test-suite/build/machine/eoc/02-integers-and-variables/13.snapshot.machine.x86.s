
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_iadd(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₄)
        leaq _x_ineg(%rip), @(var _₅)
        movq $10, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₄), %rdi
        movq @(var _₇), %rsi
        callq _x_apply_unary
        movq %rax, @(var x₁)
        leaq _x_iadd(%rip), @(var _₈)
        movq @(var _₈), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₉)
        movq $10, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
