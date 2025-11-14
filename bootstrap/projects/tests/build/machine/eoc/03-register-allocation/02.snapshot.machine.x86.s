
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _random_dice(%rip), @(var _₂)
        movq @(var _₂), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var x₁)
        leaq _random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var y₁)
        leaq _iadd(%rip), @(var _₄)
        leaq _iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var y₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₇)
        movq @(var _₄), %rdi
        movq @(var _₇), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₈)
        movq $42, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
