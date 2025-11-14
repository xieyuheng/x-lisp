
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $42, @(var _₂)
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
