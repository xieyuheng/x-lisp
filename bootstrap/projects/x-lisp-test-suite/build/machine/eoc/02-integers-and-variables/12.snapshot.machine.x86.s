
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _iadd(%rip), @(var _₂)
        leaq _iadd(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq _apply
        movq %rax, @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq _apply
        movq %rax, @(var _₇)
        movq @(var _₂), %rdi
        movq @(var _₇), %rsi
        callq _apply
        movq %rax, @(var _₈)
        leaq _iadd(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq _apply
        movq %rax, @(var _₁₁)
        leaq _iadd(%rip), @(var _₁₂)
        movq $4, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq _apply
        movq %rax, @(var _₁₄)
        movq $5, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq _apply
        movq %rax, @(var _₁₆)
        movq @(var _₁₁), %rdi
        movq @(var _₁₆), %rsi
        callq _apply
        movq %rax, @(var _₁₇)
        movq @(var _₈), %rdi
        movq @(var _₁₇), %rsi
        callq _apply
        movq %rax, @(var _₁₈)
        movq @(var _₁), %rdi
        movq @(var _₁₈), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
