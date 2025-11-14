
.text
_square:
_square.entry:
        movq %rdi, @(var x)
        leaq _imul(%rip), @(var _₁)
        movq @(var _₁), %rdi
        movq @(var x), %rsi
        callq _apply
        movq %rax, @(var _₂)
        movq @(var _₂), %rdi
        movq @(var x), %rsi
        callq _apply
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 

.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _square(%rip), @(var _₂)
        leaq _square(%rip), @(var _₃)
        movq $3, @(var _₄)
        movq @(var _₃), %rdi
        movq @(var _₄), %rsi
        callq _apply
        movq %rax, @(var _₅)
        movq @(var _₂), %rdi
        movq @(var _₅), %rsi
        callq _apply
        movq %rax, @(var _₆)
        movq @(var _₁), %rdi
        movq @(var _₆), %rsi
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
