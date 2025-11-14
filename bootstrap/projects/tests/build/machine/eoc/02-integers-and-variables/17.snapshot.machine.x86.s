
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _iadd(%rip), @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₄)
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
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
