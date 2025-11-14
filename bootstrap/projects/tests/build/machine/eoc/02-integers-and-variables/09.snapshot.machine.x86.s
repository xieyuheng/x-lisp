
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _iadd(%rip), @(var _₂)
        movq $20, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₄)
        leaq _iadd(%rip), @(var _₅)
        movq $11, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₇)
        movq $11, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₉)
        movq @(var _₄), %rdi
        movq @(var _₉), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
