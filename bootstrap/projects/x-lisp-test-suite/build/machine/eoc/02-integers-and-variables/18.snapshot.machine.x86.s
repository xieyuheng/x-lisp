
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
