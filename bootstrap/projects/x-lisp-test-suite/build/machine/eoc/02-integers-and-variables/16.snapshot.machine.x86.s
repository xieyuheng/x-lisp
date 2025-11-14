
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _isub(%rip), @(var _₂)
        movq $50, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _apply
        movq %rax, @(var _₄)
        movq $8, @(var _₅)
        movq @(var _₄), %rdi
        movq @(var _₅), %rsi
        callq _apply
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
