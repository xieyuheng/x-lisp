
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        movq $1, @(var v₁)
        movq $42, @(var w₁)
        leaq _iadd(%rip), @(var _₂)
        movq @(var _₂), %rdi
        movq @(var v₁), %rsi
        callq _apply
        movq %rax, @(var _₃)
        movq $7, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq _apply
        movq %rax, @(var x₁)
        movq @(var x₁), %rdi
        callq _identity
        movq %rax, @(var y₁)
        leaq _iadd(%rip), @(var _₅)
        movq @(var _₅), %rdi
        movq @(var x₁), %rsi
        callq _apply
        movq %rax, @(var _₆)
        movq @(var _₆), %rdi
        movq @(var w₁), %rsi
        callq _apply
        movq %rax, @(var z₁)
        leaq _iadd(%rip), @(var _₇)
        movq @(var _₇), %rdi
        movq @(var z₁), %rsi
        callq _apply
        movq %rax, @(var _₈)
        leaq _ineg(%rip), @(var _₉)
        movq @(var _₉), %rdi
        movq @(var y₁), %rsi
        callq _apply
        movq %rax, @(var _₁₀)
        movq @(var _₈), %rdi
        movq @(var _₁₀), %rsi
        callq _apply
        movq %rax, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
