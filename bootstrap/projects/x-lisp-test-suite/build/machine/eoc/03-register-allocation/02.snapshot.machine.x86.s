
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_random_dice(%rip), @(var _₂)
        movq @(var _₂), %rdi
        callq _x_apply_nullary
        movq %rax, @(var x₁)
        leaq _x_random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _x_apply_nullary
        movq %rax, @(var y₁)
        leaq _x_iadd(%rip), @(var _₄)
        leaq _x_iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var y₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₇)
        movq @(var _₄), %rdi
        movq @(var _₇), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₈)
        movq $42, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
