
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $42, @(var a₁)
        movq @(var a₁), %rdi
        callq-n _identity, @(arity 1)
        movq %rax, @(var b₁)
        movq @(var _₁), %rdi
        movq @(var b₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
