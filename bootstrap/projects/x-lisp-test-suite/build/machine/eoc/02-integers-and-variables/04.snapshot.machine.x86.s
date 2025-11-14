
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _ineg(%rip), @(var _₂)
        movq $42, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _apply
        movq %rax, @(var x₁)
        movq @(var x₁), %rdi
        callq _identity
        movq %rax, @(var y₁)
        movq @(var y₁), %rdi
        callq _identity
        movq %rax, @(var z₁)
        leaq _ineg(%rip), @(var _₄)
        movq @(var _₄), %rdi
        movq @(var z₁), %rsi
        callq _apply
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
