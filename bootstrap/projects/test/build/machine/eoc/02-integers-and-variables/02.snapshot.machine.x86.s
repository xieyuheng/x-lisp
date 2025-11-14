
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $20, @(var x₁)
        leaq _iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₃)
        movq $22, @(var x₂)
        movq @(var _₃), %rdi
        movq @(var x₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var y₁)
        movq @(var _₁), %rdi
        movq @(var y₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
