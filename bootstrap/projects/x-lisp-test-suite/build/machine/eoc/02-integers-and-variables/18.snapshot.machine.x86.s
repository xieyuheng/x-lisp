
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _iadd(%rip), @(var _₂)
        leaq _iadd(%rip), @(var _₃)
        leaq _iadd(%rip), @(var _₄)
        leaq _iadd(%rip), @(var _₅)
        leaq _random_dice(%rip), @(var _₆)
        movq @(var _₆), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _₇)
        movq @(var _₅), %rdi
        movq @(var _₇), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₈)
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₀)
        movq @(var _₄), %rdi
        movq @(var _₁₀), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₁)
        movq $1, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₃)
        movq @(var _₃), %rdi
        movq @(var _₁₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₄)
        movq $1, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₆)
        movq @(var _₂), %rdi
        movq @(var _₁₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₇)
        movq $1, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₉)
        movq @(var _₁), %rdi
        movq @(var _₁₉), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
