
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _iadd(%rip), @(var _₂)
        leaq _random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _nullary_apply
        movq %rax, @(var _₄)
        movq @(var _₂), %rdi
        movq @(var _₄), %rsi
        callq _apply
        movq %rax, @(var _₅)
        leaq _random_dice(%rip), @(var _₆)
        movq @(var _₆), %rdi
        callq _nullary_apply
        movq %rax, @(var _₇)
        movq @(var _₅), %rdi
        movq @(var _₇), %rsi
        callq _apply
        movq %rax, @(var _₈)
        movq @(var _₁), %rdi
        movq @(var _₈), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
