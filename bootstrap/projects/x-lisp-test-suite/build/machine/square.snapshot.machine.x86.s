
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _§₁.square(%rip), @(var _₂)
        leaq _§₁.square(%rip), @(var _₃)
        movq $3, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₅)
        movq @(var _₂), %rdi
        movq @(var _₅), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 

.text
_§₁.square:
_§₁.square.entry:
        movq %rdi, @(var x)
        leaq _imul(%rip), @(var _₁)
        movq @(var _₁), %rdi
        movq @(var x), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
