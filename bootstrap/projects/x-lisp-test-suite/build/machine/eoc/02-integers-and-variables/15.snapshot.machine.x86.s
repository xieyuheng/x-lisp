
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $4, @(var x₂)
        leaq _iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var x₁)
        leaq _iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₈)
        movq @(var _₁), %rdi
        movq @(var _₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
