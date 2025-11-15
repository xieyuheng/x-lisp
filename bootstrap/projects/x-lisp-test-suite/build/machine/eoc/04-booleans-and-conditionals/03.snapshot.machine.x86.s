
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        leaq _x_equal_p(%rip), @(var _₄)
        leaq _x_random_dice(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _₆)
        movq @(var _₄), %rdi
        movq @(var _₆), %rsi
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
        movq @(var _₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        movq $0, @(var _₂)
        jmp _main.main.let_body₁
_main.main.else₃:
        movq $42, @(var _₂)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        cmpq @(var _₃), $1
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq _x_equal_p(%rip), @(var _₁₀)
        leaq _x_random_dice(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq _x_apply_nullary
        movq %rax, @(var _₁₂)
        movq @(var _₁₀), %rdi
        movq @(var _₁₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₁₃)
        movq $2, @(var _₁₄)
        movq @(var _₁₃), %rdi
        movq @(var _₁₄), %rsi
        callq _x_apply_unary
        movq %rax, @(var _₃)
        jmp _main.main.let_body₄
_main.main.else₆:
        movq $0, @(var _₃)
        jmp _main.main.let_body₄
