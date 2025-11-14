
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _random_dice(%rip), @(var _₂)
        movq @(var _₂), %rdi
        callq _nullary_apply
        movq %rax, @(var x₁)
        leaq _random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _nullary_apply
        movq %rax, @(var y₁)
        leaq _iadd(%rip), @(var _₄)
        leaq _int_less?(%rip), @(var _₇)
        movq @(var _₇), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₈)
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq _apply
        movq %rax, @(var _₁₀)
        cmpq @(var _₁₀), $1
        jmpe _main.main.then₁₁
        jmp _main.main.else₁₂
_main.main.let_body₁:
        movq @(var _₂₃), %rdi
        movq @(var _₂₄), %rsi
        callq _apply
        movq %rax, @(var _₄₂)
        movq @(var _₁), %rdi
        movq @(var _₄₂), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq _iadd(%rip), @(var _₃₆)
        movq @(var _₃₆), %rdi
        movq @(var y₁), %rsi
        callq _apply
        movq %rax, @(var _₃₇)
        movq $2, @(var _₃₈)
        movq @(var _₃₇), %rdi
        movq @(var _₃₈), %rsi
        callq _apply
        movq %rax, @(var _₂₄)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq _iadd(%rip), @(var _₃₉)
        movq @(var _₃₉), %rdi
        movq @(var y₁), %rsi
        callq _apply
        movq %rax, @(var _₄₀)
        movq $10, @(var _₄₁)
        movq @(var _₄₀), %rdi
        movq @(var _₄₁), %rsi
        callq _apply
        movq %rax, @(var _₂₄)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        cmpq @(var _₂₅), $1
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq _equal?(%rip), @(var _₃₀)
        movq @(var _₃₀), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₃₁)
        movq $0, @(var _₃₂)
        movq @(var _₃₁), %rdi
        movq @(var _₃₂), %rsi
        callq _apply
        movq %rax, @(var _₂₅)
        jmp _main.main.let_body₄
_main.main.else₆:
        leaq _equal?(%rip), @(var _₃₃)
        movq @(var _₃₃), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₃₄)
        movq $2, @(var _₃₅)
        movq @(var _₃₄), %rdi
        movq @(var _₃₅), %rsi
        callq _apply
        movq %rax, @(var _₂₅)
        jmp _main.main.let_body₄
_main.main.let_body₇:
        movq @(var _₄), %rdi
        movq @(var _₅), %rsi
        callq _apply
        movq %rax, @(var _₂₃)
        leaq _int_less?(%rip), @(var _₂₆)
        movq @(var _₂₆), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq _apply
        movq %rax, @(var _₂₉)
        cmpq @(var _₂₉), $1
        jmpe _main.main.then₅
        jmp _main.main.else₆
_main.main.then₈:
        leaq _iadd(%rip), @(var _₁₇)
        movq @(var _₁₇), %rdi
        movq @(var y₁), %rsi
        callq _apply
        movq %rax, @(var _₁₈)
        movq $2, @(var _₁₉)
        movq @(var _₁₈), %rdi
        movq @(var _₁₉), %rsi
        callq _apply
        movq %rax, @(var _₅)
        jmp _main.main.let_body₇
_main.main.else₉:
        leaq _iadd(%rip), @(var _₂₀)
        movq @(var _₂₀), %rdi
        movq @(var y₁), %rsi
        callq _apply
        movq %rax, @(var _₂₁)
        movq $10, @(var _₂₂)
        movq @(var _₂₁), %rdi
        movq @(var _₂₂), %rsi
        callq _apply
        movq %rax, @(var _₅)
        jmp _main.main.let_body₇
_main.main.let_body₁₀:
        cmpq @(var _₆), $1
        jmpe _main.main.then₈
        jmp _main.main.else₉
_main.main.then₁₁:
        leaq _equal?(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₁₂)
        movq $0, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq _apply
        movq %rax, @(var _₆)
        jmp _main.main.let_body₁₀
_main.main.else₁₂:
        leaq _equal?(%rip), @(var _₁₄)
        movq @(var _₁₄), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₁₅)
        movq $2, @(var _₁₆)
        movq @(var _₁₅), %rdi
        movq @(var _₁₆), %rsi
        callq _apply
        movq %rax, @(var _₆)
        jmp _main.main.let_body₁₀
