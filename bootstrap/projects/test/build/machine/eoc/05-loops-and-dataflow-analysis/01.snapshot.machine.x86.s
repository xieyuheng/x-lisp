
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _print(%rip), @(var _₂)
        movq $1, @(var _₃)
        movq @(var _₂), %rdi
        movq @(var _₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₄)
        movq @(var _₄), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₂)
        leaq _print(%rip), @(var _₅)
        movq $2, @(var _₆)
        movq @(var _₅), %rdi
        movq @(var _₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₃)
        leaq _newline(%rip), @(var _₇)
        movq @(var _₇), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₄)
        leaq _print(%rip), @(var _₈)
        movq $3, @(var _₉)
        movq @(var _₈), %rdi
        movq @(var _₉), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₅)
        leaq _newline(%rip), @(var _₁₀)
        movq @(var _₁₀), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₆)
        movq $666, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
