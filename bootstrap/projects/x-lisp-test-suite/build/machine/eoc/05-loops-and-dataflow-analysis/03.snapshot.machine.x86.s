
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₃)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₈)
        movq @(var _₈), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₄)
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₅)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₆)
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₂)
        movq $1, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _₁₆)
        movq x_true(%rip), %rax
        cmpq @(var _₁₆), %rax
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₇)
        movq $111, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂₀)
        movq $1, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₂)
        movq $2, @(var _₂₃)
        movq @(var _₂₂), %rdi
        movq @(var _₂₃), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq x_print(%rip), %rdi
        movq $1, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂₄)
        movq $222, @(var _₂₅)
        movq @(var _₂₄), %rdi
        movq @(var _₂₅), %rsi
        callq x_apply_unary
        movq %rax, @(var _∅₁)
        leaq x_newline(%rip), %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂₆)
        movq @(var _₂₆), %rdi
        callq x_apply_nullary
        movq %rax, @(var _∅₂)
        leaq x_equal_p(%rip), %rdi
        movq $2, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂₉)
        movq $2, @(var _₃₀)
        movq @(var _₂₉), %rdi
        movq @(var _₃₀), %rsi
        callq x_apply_unary
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
