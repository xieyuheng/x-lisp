
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $1, @(var x₁)
        leaq _iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₃)
        movq $5, @(var y₁)
        leaq _iadd(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var y₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var x₂)
        leaq _iadd(%rip), @(var _₆)
        movq @(var _₆), %rdi
        movq @(var x₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₇)
        movq $100, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₉)
        movq @(var _₃), %rdi
        movq @(var _₉), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
