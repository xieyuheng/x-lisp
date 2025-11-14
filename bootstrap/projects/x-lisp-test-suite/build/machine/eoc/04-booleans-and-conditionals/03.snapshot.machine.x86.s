
.text
_main:
_main.entry:
        leaq _println_non_void(%rip), @(var _₁)
        leaq _equal_p(%rip), @(var _₄)
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
        leaq _equal_p(%rip), @(var _₁₀)
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
