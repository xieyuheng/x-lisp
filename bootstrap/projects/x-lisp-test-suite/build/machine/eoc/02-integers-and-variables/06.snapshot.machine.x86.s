
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _ineg(%rip), @(var _₂)
        leaq _random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _nullary_apply
        movq %rax, @(var _₄)
        movq @(var _₂), %rdi
        movq @(var _₄), %rsi
        callq _apply
        movq %rax, @(var _₅)
        movq @(var _₁), %rdi
        movq @(var _₅), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
