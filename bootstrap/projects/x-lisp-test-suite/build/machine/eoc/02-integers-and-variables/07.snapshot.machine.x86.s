
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_iadd(%rip), @(var _₂)
        leaq _x_random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _₄)
        movq @(var _₂), %rdi
        movq @(var _₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        leaq _x_random_dice(%rip), @(var _₆)
        movq @(var _₆), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _₇)
        movq @(var _₅), %rdi
        movq @(var _₇), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₈)
        movq @(var _₁), %rdi
        movq @(var _₈), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
