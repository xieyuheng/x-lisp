
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _iadd(%rip), @(var _₂)
        leaq _iadd(%rip), @(var _₃)
        leaq _iadd(%rip), @(var _₄)
        leaq _iadd(%rip), @(var _₅)
        leaq _random_dice(%rip), @(var _₆)
        movq @(var _₆), %rdi
        callq _nullary_apply
        movq %rax, @(var _₇)
        movq @(var _₅), %rdi
        movq @(var _₇), %rsi
        callq _apply
        movq %rax, @(var _₈)
        movq $1, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq _apply
        movq %rax, @(var _₁₀)
        movq @(var _₄), %rdi
        movq @(var _₁₀), %rsi
        callq _apply
        movq %rax, @(var _₁₁)
        movq $1, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq _apply
        movq %rax, @(var _₁₃)
        movq @(var _₃), %rdi
        movq @(var _₁₃), %rsi
        callq _apply
        movq %rax, @(var _₁₄)
        movq $1, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq _apply
        movq %rax, @(var _₁₆)
        movq @(var _₂), %rdi
        movq @(var _₁₆), %rsi
        callq _apply
        movq %rax, @(var _₁₇)
        movq $1, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq _apply
        movq %rax, @(var _₁₉)
        movq @(var _₁), %rdi
        movq @(var _₁₉), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
