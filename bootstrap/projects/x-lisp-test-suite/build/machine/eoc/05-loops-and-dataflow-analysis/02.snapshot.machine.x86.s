
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _print(%rip), @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq _apply
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₄)
        movq @(var _₄), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₂)
        leaq _print(%rip), @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq _apply
        movq %rax, @(var _∅₃)
        leaq _newline(%rip), @(var _₇)
        movq @(var _₇), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₄)
        leaq _print(%rip), @(var _₈)
        movq $3, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq _apply
        movq %rax, @(var _∅₅)
        leaq _newline(%rip), @(var _₁₀)
        movq @(var _₁₀), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₆)
        movq $6, @(var x₁)
        leaq _print(%rip), @(var _₁₁)
        movq $4, @(var _₁₂)
        movq @(var _₁₁), %rdi
        movq @(var _₁₂), %rsi
        callq _apply
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₁₃)
        movq @(var _₁₃), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₂)
        leaq _print(%rip), @(var _₁₄)
        movq $5, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq _apply
        movq %rax, @(var _∅₃)
        leaq _newline(%rip), @(var _₁₆)
        movq @(var _₁₆), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₄)
        leaq _print(%rip), @(var _₁₇)
        movq $6, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq _apply
        movq %rax, @(var _∅₅)
        leaq _newline(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₆)
        leaq _iadd(%rip), @(var _₂₀)
        movq @(var _₂₀), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₂₁)
        movq @(var _₂₁), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₂₂)
        movq @(var _₁), %rdi
        movq @(var _₂₂), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
