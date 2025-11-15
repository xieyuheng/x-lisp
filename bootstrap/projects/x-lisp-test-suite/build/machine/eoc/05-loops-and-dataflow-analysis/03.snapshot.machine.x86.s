
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_print(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₁)
        leaq _x_newline(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq _x_print(%rip), @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₃)
        leaq _x_newline(%rip), @(var _₈)
        movq @(var _₈), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₄)
        leaq _x_print(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₅)
        leaq _x_newline(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₆)
        leaq _x_equal_p(%rip), @(var _₁₂)
        movq $1, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₆)
        cmpq @(var _₁₆), $1
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq _x_print(%rip), @(var _₁₇)
        movq $111, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₁)
        leaq _x_newline(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq _x_equal_p(%rip), @(var _₂₀)
        movq $1, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₂₂)
        movq $2, @(var _₂₃)
        movq @(var _₂₂), %rdi
        movq @(var _₂₃), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq _x_print(%rip), @(var _₂₄)
        movq $222, @(var _₂₅)
        movq @(var _₂₄), %rdi
        movq @(var _₂₅), %rsi
        callq _x_apply_unary
        movq %rax, @(var _∅₁)
        leaq _x_newline(%rip), @(var _₂₆)
        movq @(var _₂₆), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq _x_equal_p(%rip), @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₂₉)
        movq $2, @(var _₃₀)
        movq @(var _₂₉), %rdi
        movq @(var _₃₀), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
