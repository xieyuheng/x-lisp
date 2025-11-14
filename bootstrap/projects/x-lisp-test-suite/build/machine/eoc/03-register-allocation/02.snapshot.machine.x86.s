
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _random_dice(%rip), @(var _₂)
        movq @(var _₂), %rdi
        callq _nullary_apply
        movq %rax, @(var x₁)
        leaq _random_dice(%rip), @(var _₃)
        movq @(var _₃), %rdi
        callq _nullary_apply
        movq %rax, @(var y₁)
        leaq _iadd(%rip), @(var _₄)
        leaq _iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var y₁), %rsi
        callq _apply
        movq %rax, @(var _₇)
        movq @(var _₄), %rdi
        movq @(var _₇), %rsi
        callq _apply
        movq %rax, @(var _₈)
        movq $42, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq _apply
        movq %rax, @(var _₁₀)
        movq @(var _₁), %rdi
        movq @(var _₁₀), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
