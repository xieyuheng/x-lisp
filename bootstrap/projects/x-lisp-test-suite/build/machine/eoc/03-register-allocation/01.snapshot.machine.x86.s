
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

.extern _identity
.extern _same?
.extern _equal?
.extern _atom?
.extern _anything?
.extern _print
.extern _println_non_void
.extern _write
.extern _newline
.extern _bool?
.extern _not
.extern _int?
.extern _int_positive?
.extern _int_non_negative?
.extern _int_non_zero?
.extern _ineg
.extern _iadd
.extern _isub
.extern _imul
.extern _idiv
.extern _imod
.extern _int_max
.extern _int_min
.extern _int_greater?
.extern _int_less?
.extern _int_greater_equal?
.extern _int_less_equal?
.extern _int_compare_ascending
.extern _int_compare_descending
.extern _float?
.extern _float_positive?
.extern _float_non_negative?
.extern _float_non_zero?
.extern _fneg
.extern _fadd
.extern _fsub
.extern _fmul
.extern _fdiv
.extern _float_max
.extern _float_min
.extern _float_greater?
.extern _float_less?
.extern _float_greater_equal?
.extern _float_less_equal?
.extern _float_compare_ascending
.extern _float_compare_descending
.extern _make_curry
.extern _curry_put!
.extern _random_dice
.extern _random_int
.extern _random_float
