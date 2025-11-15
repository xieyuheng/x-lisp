
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_print(%rip), @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₁)
        leaq _x_newline(%rip), @(var _₄)
        movq @(var _₄), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq _x_print(%rip), @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₃)
        leaq _x_newline(%rip), @(var _₇)
        movq @(var _₇), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₄)
        leaq _x_print(%rip), @(var _₈)
        movq $3, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₅)
        leaq _x_newline(%rip), @(var _₁₀)
        movq @(var _₁₀), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₆)
        movq $666, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
