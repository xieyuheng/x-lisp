
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $6, @(var y₁)
        leaq _ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var y₂)
        movq @(var y₂), %rdi
        callq-n _identity, @(arity 1)
        movq %rax, @(var x₁)
        leaq _iadd(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₅)
        movq @(var _₅), %rdi
        movq @(var y₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
