
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
        movq $22, @(var _₅)
        movq @(var _₄), %rdi
        movq @(var _₅), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
