
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        leaq x_random_dice(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        callq x_apply_nullary
        movq %rax, @(var x₁)
        leaq x_random_dice(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        movq @(var _₃), %rdi
        callq x_apply_nullary
        movq %rax, @(var y₁)
        leaq x_int_less_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₇)
        movq $1, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₉)
        movq x_true(%rip), %rax
        cmpq @(var _₉), %rax
        jmpe _main.main.then₅
        jmp _main.main.else₆
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₆)
        movq @(var _₁₆), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₇)
        movq $2, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₉)
        movq @(var _₁₉), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₀)
        movq $10, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        movq x_true(%rip), %rax
        cmpq @(var _₅), %rax
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₀)
        movq @(var _₁₀), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₁)
        movq $0, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        jmp _main.main.let_body₄
_main.main.else₆:
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₃)
        movq @(var _₁₃), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        jmp _main.main.let_body₄
