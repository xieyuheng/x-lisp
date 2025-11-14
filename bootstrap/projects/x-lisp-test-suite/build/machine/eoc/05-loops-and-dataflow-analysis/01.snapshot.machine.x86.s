
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
        movq $666, @(var _₁₁)
        movq @(var _₁), %rdi
        movq @(var _₁₁), %rsi
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
