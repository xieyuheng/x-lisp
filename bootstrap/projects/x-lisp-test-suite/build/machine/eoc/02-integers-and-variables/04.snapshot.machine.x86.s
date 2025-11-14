
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var x₁)
        movq @(var x₁), %rdi
        callq-n _identity, @(arity 1)
        movq %rax, @(var y₁)
        movq @(var y₁), %rdi
        callq-n _identity, @(arity 1)
        movq %rax, @(var z₁)
        leaq _ineg(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var z₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
