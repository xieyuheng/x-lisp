
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _print(%rip), @(var _₃)
        movq $1, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq _apply
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₂)
        leaq _print(%rip), @(var _₆)
        movq $2, @(var _₇)
        movq @(var _₆), %rdi
        movq @(var _₇), %rsi
        callq _apply
        movq %rax, @(var _∅₃)
        leaq _newline(%rip), @(var _₈)
        movq @(var _₈), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₄)
        leaq _print(%rip), @(var _₉)
        movq $3, @(var _₁₀)
        movq @(var _₉), %rdi
        movq @(var _₁₀), %rsi
        callq _apply
        movq %rax, @(var _∅₅)
        leaq _newline(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₆)
        leaq _equal_p(%rip), @(var _₁₂)
        movq $1, @(var _₁₃)
        movq @(var _₁₂), %rdi
        movq @(var _₁₃), %rsi
        callq _apply
        movq %rax, @(var _₁₄)
        movq $2, @(var _₁₅)
        movq @(var _₁₄), %rdi
        movq @(var _₁₅), %rsi
        callq _apply
        movq %rax, @(var _₁₆)
        cmpq @(var _₁₆), $1
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
_main.main.then₂:
        leaq _print(%rip), @(var _₁₇)
        movq $111, @(var _₁₈)
        movq @(var _₁₇), %rdi
        movq @(var _₁₈), %rsi
        callq _apply
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₁₉)
        movq @(var _₁₉), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₂)
        leaq _equal_p(%rip), @(var _₂₀)
        movq $1, @(var _₂₁)
        movq @(var _₂₀), %rdi
        movq @(var _₂₁), %rsi
        callq _apply
        movq %rax, @(var _₂₂)
        movq $2, @(var _₂₃)
        movq @(var _₂₂), %rdi
        movq @(var _₂₃), %rsi
        callq _apply
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq _print(%rip), @(var _₂₄)
        movq $222, @(var _₂₅)
        movq @(var _₂₄), %rdi
        movq @(var _₂₅), %rsi
        callq _apply
        movq %rax, @(var _∅₁)
        leaq _newline(%rip), @(var _₂₆)
        movq @(var _₂₆), %rdi
        callq _nullary_apply
        movq %rax, @(var _∅₂)
        leaq _equal_p(%rip), @(var _₂₇)
        movq $1, @(var _₂₈)
        movq @(var _₂₇), %rdi
        movq @(var _₂₈), %rsi
        callq _apply
        movq %rax, @(var _₂₉)
        movq $2, @(var _₃₀)
        movq @(var _₂₉), %rdi
        movq @(var _₃₀), %rsi
        callq _apply
        movq %rax, @(var _₂)
        jmp _main.main.let_body₁

.extern _identity
.extern _same_p
.extern _equal_p
.extern _atom_p
.extern _anything_p
.extern _print
.extern _println_non_void
.extern _write
.extern _newline
.extern _bool_p
.extern _not
.extern _int_p
.extern _int_positive_p
.extern _int_non_negative_p
.extern _int_non_zero_p
.extern _ineg
.extern _iadd
.extern _isub
.extern _imul
.extern _idiv
.extern _imod
.extern _int_max
.extern _int_min
.extern _int_greater_p
.extern _int_less_p
.extern _int_greater_equal_p
.extern _int_less_equal_p
.extern _int_compare_ascending
.extern _int_compare_descending
.extern _float_p
.extern _float_positive_p
.extern _float_non_negative_p
.extern _float_non_zero_p
.extern _fneg
.extern _fadd
.extern _fsub
.extern _fmul
.extern _fdiv
.extern _float_max
.extern _float_min
.extern _float_greater_p
.extern _float_less_p
.extern _float_greater_equal_p
.extern _float_less_equal_p
.extern _float_compare_ascending
.extern _float_compare_descending
.extern _make_curry
.extern _curry_put_mut
.extern _random_dice
.extern _random_int
.extern _random_float
