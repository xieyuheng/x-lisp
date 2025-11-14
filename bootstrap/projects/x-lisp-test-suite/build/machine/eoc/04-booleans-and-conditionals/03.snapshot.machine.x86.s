
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _equal?(%rip), @(var _₄)
        leaq _random_dice(%rip), @(var _₅)
        movq @(var _₅), %rdi
        callq _nullary_apply
        movq %rax, @(var _₆)
        movq @(var _₄), %rdi
        movq @(var _₆), %rsi
        callq _apply
        movq %rax, @(var _₇)
        movq $1, @(var _₈)
        movq @(var _₇), %rdi
        movq @(var _₈), %rsi
        callq _apply
        movq %rax, @(var _₉)
        cmpq @(var _₉), $1
        jmpe _main.main.then₅
        jmp _main.main.else₆
_main.main.let_body₁:
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq _apply
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
        jmpe _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq _equal?(%rip), @(var _₁₀)
        leaq _random_dice(%rip), @(var _₁₁)
        movq @(var _₁₁), %rdi
        callq _nullary_apply
        movq %rax, @(var _₁₂)
        movq @(var _₁₀), %rdi
        movq @(var _₁₂), %rsi
        callq _apply
        movq %rax, @(var _₁₃)
        movq $2, @(var _₁₄)
        movq @(var _₁₃), %rdi
        movq @(var _₁₄), %rsi
        callq _apply
        movq %rax, @(var _₃)
        jmp _main.main.let_body₄
_main.main.else₆:
        movq $0, @(var _₃)
        jmp _main.main.let_body₄

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
