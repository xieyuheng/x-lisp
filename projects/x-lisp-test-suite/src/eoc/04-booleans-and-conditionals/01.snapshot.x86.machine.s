.global _setup
.global _main

.text
.align 8
.type _main, @function
_main:
_main.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $248, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -64(%rbp)
        movq random_dice©constant(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -80(%rbp)
        movq random_dice©constant(%rip), %rax
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -96(%rbp)
        movq int_less_p©constant(%rip), %rax
        movq %rax, -104(%rbp)
        movq -104(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq $8, -120(%rbp)
        movq -112(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq x_true(%rip), %rax
        cmpq -128(%rbp), %rax
        je _main._main.then₅
        jmp _main._main.else₆
_main._main.let_body₁:
        movq -64(%rbp), %rdi
        movq -136(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq -144(%rbp), %rax
        jmp _main.epilog
_main._main.then₂:
        movq iadd©constant(%rip), %rax
        movq %rax, -152(%rbp)
        movq -152(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq $16, -168(%rbp)
        movq -160(%rbp), %rdi
        movq -168(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        jmp _main._main.let_body₁
_main._main.else₃:
        movq iadd©constant(%rip), %rax
        movq %rax, -176(%rbp)
        movq -176(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq $80, -192(%rbp)
        movq -184(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        jmp _main._main.let_body₁
_main._main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -200(%rbp), %rax
        je _main._main.then₂
        jmp _main._main.else₃
_main._main.then₅:
        movq equal_p©constant(%rip), %rax
        movq %rax, -208(%rbp)
        movq -208(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -216(%rbp)
        movq $0, -224(%rbp)
        movq -216(%rbp), %rdi
        movq -224(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -200(%rbp)
        jmp _main._main.let_body₄
_main._main.else₆:
        movq equal_p©constant(%rip), %rax
        movq %rax, -232(%rbp)
        movq -232(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -240(%rbp)
        movq $16, -248(%rbp)
        movq -240(%rbp), %rdi
        movq -248(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -200(%rbp)
        jmp _main._main.let_body₄
_main.epilog:
        addq $248, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _main, . - _main

.data
.align 8
.type _main©metadata, @object
_main©metadata:
        .quad _main©metadata.name
        .quad 0
        .quad 0
        .quad _main©variable_info
.size _main©metadata, . - _main©metadata

.data
.align 8
.type _main©metadata.name, @object
_main©metadata.name:
        .string "_main"
.size _main©metadata.name, . - _main©metadata.name

.data
.align 8
.type _main©variable_info, @object
_main©variable_info:
        .quad 24
        .quad _main©variable_info.names
.size _main©variable_info, . - _main©variable_info

.bss
.align 8
_main©constant:
        .zero 8

.text
.align 8
.type _main©setup, @function
_main©setup:
_main©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp _main©setup.body
_main©setup.body:
        movq $_main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $_main©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _main©constant(%rip)
        jmp _main©setup.epilog
_main©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _main©setup, . - _main©setup

.data
.align 8
.type equal_p©metadata, @object
equal_p©metadata:
        .quad equal_p©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size equal_p©metadata, . - equal_p©metadata

.data
.align 8
.type equal_p©metadata.name, @object
equal_p©metadata.name:
        .string "equal?"
.size equal_p©metadata.name, . - equal_p©metadata.name

.bss
.align 8
equal_p©constant:
        .zero 8

.text
.align 8
.type equal_p©setup, @function
equal_p©setup:
equal_p©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp equal_p©setup.body
equal_p©setup.body:
        movq $x_equal_p, -64(%rbp)
        orq $3, -64(%rbp)
        movq $equal_p©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, equal_p©constant(%rip)
        jmp equal_p©setup.epilog
equal_p©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size equal_p©setup, . - equal_p©setup

.data
.align 8
.type println_non_void©metadata, @object
println_non_void©metadata:
        .quad println_non_void©metadata.name
        .quad 1
        .quad 1
        .quad 0
.size println_non_void©metadata, . - println_non_void©metadata

.data
.align 8
.type println_non_void©metadata.name, @object
println_non_void©metadata.name:
        .string "println-non-void"
.size println_non_void©metadata.name, . - println_non_void©metadata.name

.bss
.align 8
println_non_void©constant:
        .zero 8

.text
.align 8
.type println_non_void©setup, @function
println_non_void©setup:
println_non_void©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp println_non_void©setup.body
println_non_void©setup.body:
        movq $x_println_non_void, -64(%rbp)
        orq $3, -64(%rbp)
        movq $println_non_void©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, println_non_void©constant(%rip)
        jmp println_non_void©setup.epilog
println_non_void©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size println_non_void©setup, . - println_non_void©setup

.data
.align 8
.type iadd©metadata, @object
iadd©metadata:
        .quad iadd©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size iadd©metadata, . - iadd©metadata

.data
.align 8
.type iadd©metadata.name, @object
iadd©metadata.name:
        .string "iadd"
.size iadd©metadata.name, . - iadd©metadata.name

.bss
.align 8
iadd©constant:
        .zero 8

.text
.align 8
.type iadd©setup, @function
iadd©setup:
iadd©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp iadd©setup.body
iadd©setup.body:
        movq $x_iadd, -64(%rbp)
        orq $3, -64(%rbp)
        movq $iadd©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, iadd©constant(%rip)
        jmp iadd©setup.epilog
iadd©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size iadd©setup, . - iadd©setup

.data
.align 8
.type int_less_p©metadata, @object
int_less_p©metadata:
        .quad int_less_p©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size int_less_p©metadata, . - int_less_p©metadata

.data
.align 8
.type int_less_p©metadata.name, @object
int_less_p©metadata.name:
        .string "int-less?"
.size int_less_p©metadata.name, . - int_less_p©metadata.name

.bss
.align 8
int_less_p©constant:
        .zero 8

.text
.align 8
.type int_less_p©setup, @function
int_less_p©setup:
int_less_p©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp int_less_p©setup.body
int_less_p©setup.body:
        movq $x_int_less_p, -64(%rbp)
        orq $3, -64(%rbp)
        movq $int_less_p©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, int_less_p©constant(%rip)
        jmp int_less_p©setup.epilog
int_less_p©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size int_less_p©setup, . - int_less_p©setup

.data
.align 8
.type make_function©metadata, @object
make_function©metadata:
        .quad make_function©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size make_function©metadata, . - make_function©metadata

.data
.align 8
.type make_function©metadata.name, @object
make_function©metadata.name:
        .string "make-function"
.size make_function©metadata.name, . - make_function©metadata.name

.bss
.align 8
make_function©constant:
        .zero 8

.text
.align 8
.type make_function©setup, @function
make_function©setup:
make_function©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp make_function©setup.body
make_function©setup.body:
        movq $x_make_function, -64(%rbp)
        orq $3, -64(%rbp)
        movq $make_function©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, make_function©constant(%rip)
        jmp make_function©setup.epilog
make_function©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size make_function©setup, . - make_function©setup

.data
.align 8
.type random_dice©metadata, @object
random_dice©metadata:
        .quad random_dice©metadata.name
        .quad 0
        .quad 1
        .quad 0
.size random_dice©metadata, . - random_dice©metadata

.data
.align 8
.type random_dice©metadata.name, @object
random_dice©metadata.name:
        .string "random-dice"
.size random_dice©metadata.name, . - random_dice©metadata.name

.bss
.align 8
random_dice©constant:
        .zero 8

.text
.align 8
.type random_dice©setup, @function
random_dice©setup:
random_dice©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp random_dice©setup.body
random_dice©setup.body:
        movq $x_random_dice, -64(%rbp)
        orq $3, -64(%rbp)
        movq $random_dice©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, random_dice©constant(%rip)
        jmp random_dice©setup.epilog
random_dice©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size random_dice©setup, . - random_dice©setup

.text
.align 8
.type _setup, @function
_setup:
_setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $64, %rsp
        jmp _setup.body
_setup.body:
        callq _main©setup
        movq %rax, -64(%rbp)
        callq equal_p©setup
        movq %rax, -64(%rbp)
        callq println_non_void©setup
        movq %rax, -64(%rbp)
        callq iadd©setup
        movq %rax, -64(%rbp)
        callq int_less_p©setup
        movq %rax, -64(%rbp)
        callq make_function©setup
        movq %rax, -64(%rbp)
        callq random_dice©setup
        movq %rax, -64(%rbp)
_setup.epilog:
        addq $64, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _setup, . - _setup

.data
.align 8
.type _main©variable_info.names, @object
_main©variable_info.names:
        .quad _main©variable_info.names.0
        .quad _main©variable_info.names.1
        .quad _main©variable_info.names.2
        .quad _main©variable_info.names.3
        .quad _main©variable_info.names.4
        .quad _main©variable_info.names.5
        .quad _main©variable_info.names.6
        .quad _main©variable_info.names.7
        .quad _main©variable_info.names.8
        .quad _main©variable_info.names.9
        .quad _main©variable_info.names.10
        .quad _main©variable_info.names.11
        .quad _main©variable_info.names.12
        .quad _main©variable_info.names.13
        .quad _main©variable_info.names.14
        .quad _main©variable_info.names.15
        .quad _main©variable_info.names.16
        .quad _main©variable_info.names.17
        .quad _main©variable_info.names.18
        .quad _main©variable_info.names.19
        .quad _main©variable_info.names.20
        .quad _main©variable_info.names.21
        .quad _main©variable_info.names.22
        .quad _main©variable_info.names.23
.size _main©variable_info.names, . - _main©variable_info.names

.data
.align 8
.type _main©variable_info.names.0, @object
_main©variable_info.names.0:
        .string "_₁"
.size _main©variable_info.names.0, . - _main©variable_info.names.0

.data
.align 8
.type _main©variable_info.names.1, @object
_main©variable_info.names.1:
        .string "_₂"
.size _main©variable_info.names.1, . - _main©variable_info.names.1

.data
.align 8
.type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "x₁"
.size _main©variable_info.names.2, . - _main©variable_info.names.2

.data
.align 8
.type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_₃"
.size _main©variable_info.names.3, . - _main©variable_info.names.3

.data
.align 8
.type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "y₁"
.size _main©variable_info.names.4, . - _main©variable_info.names.4

.data
.align 8
.type _main©variable_info.names.5, @object
_main©variable_info.names.5:
        .string "_₆"
.size _main©variable_info.names.5, . - _main©variable_info.names.5

.data
.align 8
.type _main©variable_info.names.6, @object
_main©variable_info.names.6:
        .string "_₇"
.size _main©variable_info.names.6, . - _main©variable_info.names.6

.data
.align 8
.type _main©variable_info.names.7, @object
_main©variable_info.names.7:
        .string "_₈"
.size _main©variable_info.names.7, . - _main©variable_info.names.7

.data
.align 8
.type _main©variable_info.names.8, @object
_main©variable_info.names.8:
        .string "_₉"
.size _main©variable_info.names.8, . - _main©variable_info.names.8

.data
.align 8
.type _main©variable_info.names.9, @object
_main©variable_info.names.9:
        .string "_₄"
.size _main©variable_info.names.9, . - _main©variable_info.names.9

.data
.align 8
.type _main©variable_info.names.10, @object
_main©variable_info.names.10:
        .string "_↩"
.size _main©variable_info.names.10, . - _main©variable_info.names.10

.data
.align 8
.type _main©variable_info.names.11, @object
_main©variable_info.names.11:
        .string "_₁₆"
.size _main©variable_info.names.11, . - _main©variable_info.names.11

.data
.align 8
.type _main©variable_info.names.12, @object
_main©variable_info.names.12:
        .string "_₁₇"
.size _main©variable_info.names.12, . - _main©variable_info.names.12

.data
.align 8
.type _main©variable_info.names.13, @object
_main©variable_info.names.13:
        .string "_₁₈"
.size _main©variable_info.names.13, . - _main©variable_info.names.13

.data
.align 8
.type _main©variable_info.names.14, @object
_main©variable_info.names.14:
        .string "_₁₉"
.size _main©variable_info.names.14, . - _main©variable_info.names.14

.data
.align 8
.type _main©variable_info.names.15, @object
_main©variable_info.names.15:
        .string "_₂₀"
.size _main©variable_info.names.15, . - _main©variable_info.names.15

.data
.align 8
.type _main©variable_info.names.16, @object
_main©variable_info.names.16:
        .string "_₂₁"
.size _main©variable_info.names.16, . - _main©variable_info.names.16

.data
.align 8
.type _main©variable_info.names.17, @object
_main©variable_info.names.17:
        .string "_₅"
.size _main©variable_info.names.17, . - _main©variable_info.names.17

.data
.align 8
.type _main©variable_info.names.18, @object
_main©variable_info.names.18:
        .string "_₁₀"
.size _main©variable_info.names.18, . - _main©variable_info.names.18

.data
.align 8
.type _main©variable_info.names.19, @object
_main©variable_info.names.19:
        .string "_₁₁"
.size _main©variable_info.names.19, . - _main©variable_info.names.19

.data
.align 8
.type _main©variable_info.names.20, @object
_main©variable_info.names.20:
        .string "_₁₂"
.size _main©variable_info.names.20, . - _main©variable_info.names.20

.data
.align 8
.type _main©variable_info.names.21, @object
_main©variable_info.names.21:
        .string "_₁₃"
.size _main©variable_info.names.21, . - _main©variable_info.names.21

.data
.align 8
.type _main©variable_info.names.22, @object
_main©variable_info.names.22:
        .string "_₁₄"
.size _main©variable_info.names.22, . - _main©variable_info.names.22

.data
.align 8
.type _main©variable_info.names.23, @object
_main©variable_info.names.23:
        .string "_₁₅"
.size _main©variable_info.names.23, . - _main©variable_info.names.23

.data
.align 8
.type _main©setup©variable_info, @object
_main©setup©variable_info:
        .quad 3
        .quad _main©setup©variable_info.names
.size _main©setup©variable_info, . - _main©setup©variable_info

.data
.align 8
.type _main©setup©variable_info.names, @object
_main©setup©variable_info.names:
        .quad _main©setup©variable_info.names.0
        .quad _main©setup©variable_info.names.1
        .quad _main©setup©variable_info.names.2
.size _main©setup©variable_info.names, . - _main©setup©variable_info.names

.data
.align 8
.type _main©setup©variable_info.names.0, @object
_main©setup©variable_info.names.0:
        .string "address"
.size _main©setup©variable_info.names.0, . - _main©setup©variable_info.names.0

.data
.align 8
.type _main©setup©variable_info.names.1, @object
_main©setup©variable_info.names.1:
        .string "metadata"
.size _main©setup©variable_info.names.1, . - _main©setup©variable_info.names.1

.data
.align 8
.type _main©setup©variable_info.names.2, @object
_main©setup©variable_info.names.2:
        .string "function"
.size _main©setup©variable_info.names.2, . - _main©setup©variable_info.names.2

.data
.align 8
.type equal_p©setup©variable_info, @object
equal_p©setup©variable_info:
        .quad 3
        .quad equal_p©setup©variable_info.names
.size equal_p©setup©variable_info, . - equal_p©setup©variable_info

.data
.align 8
.type equal_p©setup©variable_info.names, @object
equal_p©setup©variable_info.names:
        .quad equal_p©setup©variable_info.names.0
        .quad equal_p©setup©variable_info.names.1
        .quad equal_p©setup©variable_info.names.2
.size equal_p©setup©variable_info.names, . - equal_p©setup©variable_info.names

.data
.align 8
.type equal_p©setup©variable_info.names.0, @object
equal_p©setup©variable_info.names.0:
        .string "address"
.size equal_p©setup©variable_info.names.0, . - equal_p©setup©variable_info.names.0

.data
.align 8
.type equal_p©setup©variable_info.names.1, @object
equal_p©setup©variable_info.names.1:
        .string "metadata"
.size equal_p©setup©variable_info.names.1, . - equal_p©setup©variable_info.names.1

.data
.align 8
.type equal_p©setup©variable_info.names.2, @object
equal_p©setup©variable_info.names.2:
        .string "function"
.size equal_p©setup©variable_info.names.2, . - equal_p©setup©variable_info.names.2

.data
.align 8
.type println_non_void©setup©variable_info, @object
println_non_void©setup©variable_info:
        .quad 3
        .quad println_non_void©setup©variable_info.names
.size println_non_void©setup©variable_info, . - println_non_void©setup©variable_info

.data
.align 8
.type println_non_void©setup©variable_info.names, @object
println_non_void©setup©variable_info.names:
        .quad println_non_void©setup©variable_info.names.0
        .quad println_non_void©setup©variable_info.names.1
        .quad println_non_void©setup©variable_info.names.2
.size println_non_void©setup©variable_info.names, . - println_non_void©setup©variable_info.names

.data
.align 8
.type println_non_void©setup©variable_info.names.0, @object
println_non_void©setup©variable_info.names.0:
        .string "address"
.size println_non_void©setup©variable_info.names.0, . - println_non_void©setup©variable_info.names.0

.data
.align 8
.type println_non_void©setup©variable_info.names.1, @object
println_non_void©setup©variable_info.names.1:
        .string "metadata"
.size println_non_void©setup©variable_info.names.1, . - println_non_void©setup©variable_info.names.1

.data
.align 8
.type println_non_void©setup©variable_info.names.2, @object
println_non_void©setup©variable_info.names.2:
        .string "function"
.size println_non_void©setup©variable_info.names.2, . - println_non_void©setup©variable_info.names.2

.data
.align 8
.type iadd©setup©variable_info, @object
iadd©setup©variable_info:
        .quad 3
        .quad iadd©setup©variable_info.names
.size iadd©setup©variable_info, . - iadd©setup©variable_info

.data
.align 8
.type iadd©setup©variable_info.names, @object
iadd©setup©variable_info.names:
        .quad iadd©setup©variable_info.names.0
        .quad iadd©setup©variable_info.names.1
        .quad iadd©setup©variable_info.names.2
.size iadd©setup©variable_info.names, . - iadd©setup©variable_info.names

.data
.align 8
.type iadd©setup©variable_info.names.0, @object
iadd©setup©variable_info.names.0:
        .string "address"
.size iadd©setup©variable_info.names.0, . - iadd©setup©variable_info.names.0

.data
.align 8
.type iadd©setup©variable_info.names.1, @object
iadd©setup©variable_info.names.1:
        .string "metadata"
.size iadd©setup©variable_info.names.1, . - iadd©setup©variable_info.names.1

.data
.align 8
.type iadd©setup©variable_info.names.2, @object
iadd©setup©variable_info.names.2:
        .string "function"
.size iadd©setup©variable_info.names.2, . - iadd©setup©variable_info.names.2

.data
.align 8
.type int_less_p©setup©variable_info, @object
int_less_p©setup©variable_info:
        .quad 3
        .quad int_less_p©setup©variable_info.names
.size int_less_p©setup©variable_info, . - int_less_p©setup©variable_info

.data
.align 8
.type int_less_p©setup©variable_info.names, @object
int_less_p©setup©variable_info.names:
        .quad int_less_p©setup©variable_info.names.0
        .quad int_less_p©setup©variable_info.names.1
        .quad int_less_p©setup©variable_info.names.2
.size int_less_p©setup©variable_info.names, . - int_less_p©setup©variable_info.names

.data
.align 8
.type int_less_p©setup©variable_info.names.0, @object
int_less_p©setup©variable_info.names.0:
        .string "address"
.size int_less_p©setup©variable_info.names.0, . - int_less_p©setup©variable_info.names.0

.data
.align 8
.type int_less_p©setup©variable_info.names.1, @object
int_less_p©setup©variable_info.names.1:
        .string "metadata"
.size int_less_p©setup©variable_info.names.1, . - int_less_p©setup©variable_info.names.1

.data
.align 8
.type int_less_p©setup©variable_info.names.2, @object
int_less_p©setup©variable_info.names.2:
        .string "function"
.size int_less_p©setup©variable_info.names.2, . - int_less_p©setup©variable_info.names.2

.data
.align 8
.type make_function©setup©variable_info, @object
make_function©setup©variable_info:
        .quad 3
        .quad make_function©setup©variable_info.names
.size make_function©setup©variable_info, . - make_function©setup©variable_info

.data
.align 8
.type make_function©setup©variable_info.names, @object
make_function©setup©variable_info.names:
        .quad make_function©setup©variable_info.names.0
        .quad make_function©setup©variable_info.names.1
        .quad make_function©setup©variable_info.names.2
.size make_function©setup©variable_info.names, . - make_function©setup©variable_info.names

.data
.align 8
.type make_function©setup©variable_info.names.0, @object
make_function©setup©variable_info.names.0:
        .string "address"
.size make_function©setup©variable_info.names.0, . - make_function©setup©variable_info.names.0

.data
.align 8
.type make_function©setup©variable_info.names.1, @object
make_function©setup©variable_info.names.1:
        .string "metadata"
.size make_function©setup©variable_info.names.1, . - make_function©setup©variable_info.names.1

.data
.align 8
.type make_function©setup©variable_info.names.2, @object
make_function©setup©variable_info.names.2:
        .string "function"
.size make_function©setup©variable_info.names.2, . - make_function©setup©variable_info.names.2

.data
.align 8
.type random_dice©setup©variable_info, @object
random_dice©setup©variable_info:
        .quad 3
        .quad random_dice©setup©variable_info.names
.size random_dice©setup©variable_info, . - random_dice©setup©variable_info

.data
.align 8
.type random_dice©setup©variable_info.names, @object
random_dice©setup©variable_info.names:
        .quad random_dice©setup©variable_info.names.0
        .quad random_dice©setup©variable_info.names.1
        .quad random_dice©setup©variable_info.names.2
.size random_dice©setup©variable_info.names, . - random_dice©setup©variable_info.names

.data
.align 8
.type random_dice©setup©variable_info.names.0, @object
random_dice©setup©variable_info.names.0:
        .string "address"
.size random_dice©setup©variable_info.names.0, . - random_dice©setup©variable_info.names.0

.data
.align 8
.type random_dice©setup©variable_info.names.1, @object
random_dice©setup©variable_info.names.1:
        .string "metadata"
.size random_dice©setup©variable_info.names.1, . - random_dice©setup©variable_info.names.1

.data
.align 8
.type random_dice©setup©variable_info.names.2, @object
random_dice©setup©variable_info.names.2:
        .string "function"
.size random_dice©setup©variable_info.names.2, . - random_dice©setup©variable_info.names.2

.data
.align 8
.type _setup©variable_info, @object
_setup©variable_info:
        .quad 1
        .quad _setup©variable_info.names
.size _setup©variable_info, . - _setup©variable_info

.data
.align 8
.type _setup©variable_info.names, @object
_setup©variable_info.names:
        .quad _setup©variable_info.names.0
.size _setup©variable_info.names, . - _setup©variable_info.names

.data
.align 8
.type _setup©variable_info.names.0, @object
_setup©variable_info.names.0:
        .string "_"
.size _setup©variable_info.names.0, . - _setup©variable_info.names.0
