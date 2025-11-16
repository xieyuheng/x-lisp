
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
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₄)
        leaq x_int_less_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₇)
        movq @(var _₇), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₈)
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₀)
        movq x_true(%rip), %rax
        cmpq @(var _₁₀), %rax
        jmpe _main.main.then₁₁
        jmp _main.main.else₁₂
_main.main.let_body₁:
        movq @(var _₂₃), %rdi
        movq @(var _₂₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄₂)
        movq @(var _₁), %rdi
        movq @(var _₄₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃₆)
        movq @(var _₃₆), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃₇)
        movq $2, @(var _₃₈)
        movq @(var _₃₇), %rdi
        movq @(var _₃₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₄)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃₉)
        movq @(var _₃₉), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₄₀)
        movq $10, @(var _₄₁)
        movq @(var _₄₀), %rdi
        movq @(var _₄₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₄)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        movq x_true(%rip), %rax
        cmpq @(var _₂₅), %rax
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃₀)
        movq @(var _₃₀), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃₁)
        movq $0, @(var _₃₂)
        movq @(var _₃₁), %rdi
        movq @(var _₃₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₅)
        jmp _main.main.let_body₄
_main.main.else₆:
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃₃)
        movq @(var _₃₃), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₃₄)
        movq $2, @(var _₃₅)
        movq @(var _₃₄), %rdi
        movq @(var _₃₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₅)
        jmp _main.main.let_body₄
_main.main.let_body₇:
        movq @(var _₄), %rdi
        movq @(var _₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₃)
        leaq x_int_less_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂₆)
        movq @(var _₂₆), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₉)
        movq x_true(%rip), %rax
        cmpq @(var _₂₉), %rax
        jmpe _main.main.then₅
        jmp _main.main.else₆
_main.main.then₈:
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₇)
        movq @(var _₁₇), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₈)
        movq $2, @(var _₁₉)
        movq @(var _₁₈), %rdi
        movq @(var _₁₉), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        jmp _main.main.let_body₇
_main.main.else₉:
        leaq x_iadd(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂₀)
        movq @(var _₂₀), %rdi
        movq @(var y₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₁)
        movq $10, @(var _₂₂)
        movq @(var _₂₁), %rdi
        movq @(var _₂₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _₅)
        jmp _main.main.let_body₇
_main.main.let_body₁₀:
        movq x_true(%rip), %rax
        cmpq @(var _₆), %rax
        jmpe _main.main.then₈
        jmp _main.main.else₉
_main.main.then₁₁:
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₁)
        movq @(var _₁₁), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₂)
        movq $0, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        jmp _main.main.let_body₁₀
_main.main.else₁₂:
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₄)
        movq @(var _₁₄), %rdi
        movq @(var x₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₅)
        movq $2, @(var _₁₆)
        movq @(var _₁₅), %rdi
        movq @(var _₁₆), %rsi
        callq x_apply_unary
        movq %rax, @(var _₆)
        jmp _main.main.let_body₁₀
