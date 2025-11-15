
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_ineg(%rip), @(var _₂)
        leaq _x_random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _₄)
        movq @(var _₂), %rdi
        movq @(var _₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
