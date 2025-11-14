
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $32, @(var x₁)
        leaq _iadd(%rip), @(var _₂)
        movq $10, @(var x₂)
        movq @(var _₂), %rdi
        movq @(var x₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₃)
        movq @(var _₃), %rdi
        movq @(var x₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₄)
        movq @(var _₁), %rdi
        movq @(var _₄), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
