
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
        leaq _x_int_less_p(%rip), @(var _₆)
        movq @(var _₆), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₇)
        movq $1, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₉)
        cmpq @(var _₉), $1
        jmpe _main.main.then₅
        jmp _main.main.else₆
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq _x_iadd(%rip), @(var _₁₆)
        movq @(var _₁₆), %rdi
        movq @(var y₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₇)
        movq $2, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₄)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq _x_iadd(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        movq @(var y₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₂₀)
        movq $10, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₄)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        cmpq @(var _₅), $1
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq _x_equal_p(%rip), @(var _₁₀)
        movq @(var _₁₀), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₁)
        movq $0, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        jmp _main.main.let_body₄
_main.main.else₆:
        leaq _x_equal_p(%rip), @(var _₁₃)
        movq @(var _₁₃), %rdi
        movq @(var x₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₅)
        jmp _main.main.let_body₄
