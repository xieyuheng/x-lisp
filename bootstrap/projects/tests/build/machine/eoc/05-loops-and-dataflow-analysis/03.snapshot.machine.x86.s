
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _print(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₂)
        leaq _print(%rip), @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₃)
        leaq _newline(%rip), @(var _₈)
        movq @(var _₈), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₄)
        leaq _print(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₅)
        leaq _newline(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₆)
        leaq _equal?(%rip), @(var _₁₂)
        movq $1, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₆)
        cmpq @(var _₁₆), $1
        branch-if @(cc e), _main.main.then₂, _main.main.else₃
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq _print(%rip), @(var _₁₇)
        movq $111, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₂)
        leaq _equal?(%rip), @(var _₂₀)
        movq $1, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₂₂)
        movq $2, @(var _₂₃)
        movq @(var _₂₂), %rdi
        movq @(var _₂₃), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq _print(%rip), @(var _₂₄)
        movq $222, @(var _₂₅)
        movq @(var _₂₄), %rdi
        movq @(var _₂₅), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₂₆)
        movq @(var _₂₆), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _∅₂)
        leaq _equal?(%rip), @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₂₉)
        movq $2, @(var _₃₀)
        movq @(var _₂₉), %rdi
        movq @(var _₃₀), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
