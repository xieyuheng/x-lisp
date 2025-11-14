
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _equal?(%rip), @(var _₄)
        leaq _random_dice(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _₆)
        movq @(var _₄), %rdi
        movq @(var _₆), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₇)
        movq $1, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₉)
        cmpq @(var _₉), $1
        branch-if @(cc e), _main.main.then₅, _main.main.else₆
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        movq $0, @(var _₂)
        jmp _main.main.let_body₁
_main.main.else₃:
        movq $42, @(var _₂)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        cmpq @(var _₃), $1
        branch-if @(cc e), _main.main.then₂, _main.main.else₃
_main.main.then₅:
        leaq _equal?(%rip), @(var _₁₀)
        leaq _random_dice(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq-n _nullary_apply, @(arity 1)
        movq %rax, @(var _₁₂)
        movq @(var _₁₀), %rdi
        movq @(var _₁₂), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₁₃)
        movq $2, @(var _₁₄)
        movq @(var _₁₃), %rdi
        movq @(var _₁₄), %rsi
        callq-n _apply, @(arity 2)
        movq %rax, @(var _₃)
        jmp _main.main.let_body₄
_main.main.else₆:
        movq $0, @(var _₃)
        jmp _main.main.let_body₄
