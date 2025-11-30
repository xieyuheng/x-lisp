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
        subq $416, %rsp
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
        movq iadd©constant(%rip), %rax
        movq %rax, -104(%rbp)
        movq int_less_p©constant(%rip), %rax
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        movq $8, -128(%rbp)
        movq -120(%rbp), %rdi
        movq -128(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq x_true(%rip), %rax
        cmpq -136(%rbp), %rax
        je _main._main.then₁₁
        jmp _main._main.else₁₂
_main._main.let_body₁:
        movq -144(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -64(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq -168(%rbp), %rax
        jmp _main.epilog
_main._main.then₂:
        movq iadd©constant(%rip), %rax
        movq %rax, -176(%rbp)
        movq -176(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq $16, -192(%rbp)
        movq -184(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        jmp _main._main.let_body₁
_main._main.else₃:
        movq iadd©constant(%rip), %rax
        movq %rax, -200(%rbp)
        movq -200(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -208(%rbp)
        movq $80, -216(%rbp)
        movq -208(%rbp), %rdi
        movq -216(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        jmp _main._main.let_body₁
_main._main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -224(%rbp), %rax
        je _main._main.then₂
        jmp _main._main.else₃
_main._main.then₅:
        movq equal_p©constant(%rip), %rax
        movq %rax, -232(%rbp)
        movq -232(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -240(%rbp)
        movq $0, -248(%rbp)
        movq -240(%rbp), %rdi
        movq -248(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -224(%rbp)
        jmp _main._main.let_body₄
_main._main.else₆:
        movq equal_p©constant(%rip), %rax
        movq %rax, -256(%rbp)
        movq -256(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -264(%rbp)
        movq $16, -272(%rbp)
        movq -264(%rbp), %rdi
        movq -272(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -224(%rbp)
        jmp _main._main.let_body₄
_main._main.let_body₇:
        movq -104(%rbp), %rdi
        movq -280(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq int_less_p©constant(%rip), %rax
        movq %rax, -288(%rbp)
        movq -288(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -296(%rbp)
        movq $8, -304(%rbp)
        movq -296(%rbp), %rdi
        movq -304(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -312(%rbp)
        movq x_true(%rip), %rax
        cmpq -312(%rbp), %rax
        je _main._main.then₅
        jmp _main._main.else₆
_main._main.then₈:
        movq iadd©constant(%rip), %rax
        movq %rax, -320(%rbp)
        movq -320(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -328(%rbp)
        movq $16, -336(%rbp)
        movq -328(%rbp), %rdi
        movq -336(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -280(%rbp)
        jmp _main._main.let_body₇
_main._main.else₉:
        movq iadd©constant(%rip), %rax
        movq %rax, -344(%rbp)
        movq -344(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -352(%rbp)
        movq $80, -360(%rbp)
        movq -352(%rbp), %rdi
        movq -360(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -280(%rbp)
        jmp _main._main.let_body₇
_main._main.let_body₁₀:
        movq x_true(%rip), %rax
        cmpq -368(%rbp), %rax
        je _main._main.then₈
        jmp _main._main.else₉
_main._main.then₁₁:
        movq equal_p©constant(%rip), %rax
        movq %rax, -376(%rbp)
        movq -376(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -384(%rbp)
        movq $0, -392(%rbp)
        movq -384(%rbp), %rdi
        movq -392(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -368(%rbp)
        jmp _main._main.let_body₁₀
_main._main.else₁₂:
        movq equal_p©constant(%rip), %rax
        movq %rax, -400(%rbp)
        movq -400(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -408(%rbp)
        movq $16, -416(%rbp)
        movq -408(%rbp), %rdi
        movq -416(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -368(%rbp)
        jmp _main._main.let_body₁₀
_main.epilog:
        addq $416, %rsp
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
        .quad 45
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
        subq $88, %rsp
        jmp _main©setup.body
_main©setup.body:
        movq $_main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $0, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, _main©constant(%rip)
        jmp _main©setup.epilog
_main©setup.epilog:
        addq $88, %rsp
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
        .quad equal_p©variable_info
.size equal_p©metadata, . - equal_p©metadata

.data
.align 8
.type equal_p©metadata.name, @object
equal_p©metadata.name:
        .string "equal?"
.size equal_p©metadata.name, . - equal_p©metadata.name

.data
.align 8
.type equal_p©variable_info, @object
equal_p©variable_info:

.size equal_p©variable_info, . - equal_p©variable_info

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
        subq $88, %rsp
        jmp equal_p©setup.body
equal_p©setup.body:
        movq $x_equal_p, -64(%rbp)
        orq $3, -64(%rbp)
        movq $16, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, equal_p©constant(%rip)
        jmp equal_p©setup.epilog
equal_p©setup.epilog:
        addq $88, %rsp
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
        .quad println_non_void©variable_info
.size println_non_void©metadata, . - println_non_void©metadata

.data
.align 8
.type println_non_void©metadata.name, @object
println_non_void©metadata.name:
        .string "println-non-void"
.size println_non_void©metadata.name, . - println_non_void©metadata.name

.data
.align 8
.type println_non_void©variable_info, @object
println_non_void©variable_info:

.size println_non_void©variable_info, . - println_non_void©variable_info

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
        subq $88, %rsp
        jmp println_non_void©setup.body
println_non_void©setup.body:
        movq $x_println_non_void, -64(%rbp)
        orq $3, -64(%rbp)
        movq $8, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, println_non_void©constant(%rip)
        jmp println_non_void©setup.epilog
println_non_void©setup.epilog:
        addq $88, %rsp
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
        .quad iadd©variable_info
.size iadd©metadata, . - iadd©metadata

.data
.align 8
.type iadd©metadata.name, @object
iadd©metadata.name:
        .string "iadd"
.size iadd©metadata.name, . - iadd©metadata.name

.data
.align 8
.type iadd©variable_info, @object
iadd©variable_info:

.size iadd©variable_info, . - iadd©variable_info

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
        subq $88, %rsp
        jmp iadd©setup.body
iadd©setup.body:
        movq $x_iadd, -64(%rbp)
        orq $3, -64(%rbp)
        movq $16, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, iadd©constant(%rip)
        jmp iadd©setup.epilog
iadd©setup.epilog:
        addq $88, %rsp
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
        .quad int_less_p©variable_info
.size int_less_p©metadata, . - int_less_p©metadata

.data
.align 8
.type int_less_p©metadata.name, @object
int_less_p©metadata.name:
        .string "int-less?"
.size int_less_p©metadata.name, . - int_less_p©metadata.name

.data
.align 8
.type int_less_p©variable_info, @object
int_less_p©variable_info:

.size int_less_p©variable_info, . - int_less_p©variable_info

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
        subq $88, %rsp
        jmp int_less_p©setup.body
int_less_p©setup.body:
        movq $x_int_less_p, -64(%rbp)
        orq $3, -64(%rbp)
        movq $16, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, int_less_p©constant(%rip)
        jmp int_less_p©setup.epilog
int_less_p©setup.epilog:
        addq $88, %rsp
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
.type make_curry©metadata, @object
make_curry©metadata:
        .quad make_curry©metadata.name
        .quad 3
        .quad 1
        .quad make_curry©variable_info
.size make_curry©metadata, . - make_curry©metadata

.data
.align 8
.type make_curry©metadata.name, @object
make_curry©metadata.name:
        .string "make-curry"
.size make_curry©metadata.name, . - make_curry©metadata.name

.data
.align 8
.type make_curry©variable_info, @object
make_curry©variable_info:

.size make_curry©variable_info, . - make_curry©variable_info

.bss
.align 8
make_curry©constant:
        .zero 8

.text
.align 8
.type make_curry©setup, @function
make_curry©setup:
make_curry©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp make_curry©setup.body
make_curry©setup.body:
        movq $x_make_curry, -64(%rbp)
        orq $3, -64(%rbp)
        movq $24, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, make_curry©constant(%rip)
        jmp make_curry©setup.epilog
make_curry©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size make_curry©setup, . - make_curry©setup

.data
.align 8
.type random_dice©metadata, @object
random_dice©metadata:
        .quad random_dice©metadata.name
        .quad 0
        .quad 1
        .quad random_dice©variable_info
.size random_dice©metadata, . - random_dice©metadata

.data
.align 8
.type random_dice©metadata.name, @object
random_dice©metadata.name:
        .string "random-dice"
.size random_dice©metadata.name, . - random_dice©metadata.name

.data
.align 8
.type random_dice©variable_info, @object
random_dice©variable_info:

.size random_dice©variable_info, . - random_dice©variable_info

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
        subq $88, %rsp
        jmp random_dice©setup.body
random_dice©setup.body:
        movq $x_random_dice, -64(%rbp)
        orq $3, -64(%rbp)
        movq $0, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, random_dice©constant(%rip)
        jmp random_dice©setup.epilog
random_dice©setup.epilog:
        addq $88, %rsp
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
        callq make_curry©setup
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
        .quad _main©variable_info.names.24
        .quad _main©variable_info.names.25
        .quad _main©variable_info.names.26
        .quad _main©variable_info.names.27
        .quad _main©variable_info.names.28
        .quad _main©variable_info.names.29
        .quad _main©variable_info.names.30
        .quad _main©variable_info.names.31
        .quad _main©variable_info.names.32
        .quad _main©variable_info.names.33
        .quad _main©variable_info.names.34
        .quad _main©variable_info.names.35
        .quad _main©variable_info.names.36
        .quad _main©variable_info.names.37
        .quad _main©variable_info.names.38
        .quad _main©variable_info.names.39
        .quad _main©variable_info.names.40
        .quad _main©variable_info.names.41
        .quad _main©variable_info.names.42
        .quad _main©variable_info.names.43
        .quad _main©variable_info.names.44
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
        .string "_₄"
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
        .string "_₁₀"
.size _main©variable_info.names.9, . - _main©variable_info.names.9

.data
.align 8
.type _main©variable_info.names.10, @object
_main©variable_info.names.10:
        .string "_₂₃"
.size _main©variable_info.names.10, . - _main©variable_info.names.10

.data
.align 8
.type _main©variable_info.names.11, @object
_main©variable_info.names.11:
        .string "_₂₄"
.size _main©variable_info.names.11, . - _main©variable_info.names.11

.data
.align 8
.type _main©variable_info.names.12, @object
_main©variable_info.names.12:
        .string "_₄₂"
.size _main©variable_info.names.12, . - _main©variable_info.names.12

.data
.align 8
.type _main©variable_info.names.13, @object
_main©variable_info.names.13:
        .string "_↩"
.size _main©variable_info.names.13, . - _main©variable_info.names.13

.data
.align 8
.type _main©variable_info.names.14, @object
_main©variable_info.names.14:
        .string "_₃₆"
.size _main©variable_info.names.14, . - _main©variable_info.names.14

.data
.align 8
.type _main©variable_info.names.15, @object
_main©variable_info.names.15:
        .string "_₃₇"
.size _main©variable_info.names.15, . - _main©variable_info.names.15

.data
.align 8
.type _main©variable_info.names.16, @object
_main©variable_info.names.16:
        .string "_₃₈"
.size _main©variable_info.names.16, . - _main©variable_info.names.16

.data
.align 8
.type _main©variable_info.names.17, @object
_main©variable_info.names.17:
        .string "_₃₉"
.size _main©variable_info.names.17, . - _main©variable_info.names.17

.data
.align 8
.type _main©variable_info.names.18, @object
_main©variable_info.names.18:
        .string "_₄₀"
.size _main©variable_info.names.18, . - _main©variable_info.names.18

.data
.align 8
.type _main©variable_info.names.19, @object
_main©variable_info.names.19:
        .string "_₄₁"
.size _main©variable_info.names.19, . - _main©variable_info.names.19

.data
.align 8
.type _main©variable_info.names.20, @object
_main©variable_info.names.20:
        .string "_₂₅"
.size _main©variable_info.names.20, . - _main©variable_info.names.20

.data
.align 8
.type _main©variable_info.names.21, @object
_main©variable_info.names.21:
        .string "_₃₀"
.size _main©variable_info.names.21, . - _main©variable_info.names.21

.data
.align 8
.type _main©variable_info.names.22, @object
_main©variable_info.names.22:
        .string "_₃₁"
.size _main©variable_info.names.22, . - _main©variable_info.names.22

.data
.align 8
.type _main©variable_info.names.23, @object
_main©variable_info.names.23:
        .string "_₃₂"
.size _main©variable_info.names.23, . - _main©variable_info.names.23

.data
.align 8
.type _main©variable_info.names.24, @object
_main©variable_info.names.24:
        .string "_₃₃"
.size _main©variable_info.names.24, . - _main©variable_info.names.24

.data
.align 8
.type _main©variable_info.names.25, @object
_main©variable_info.names.25:
        .string "_₃₄"
.size _main©variable_info.names.25, . - _main©variable_info.names.25

.data
.align 8
.type _main©variable_info.names.26, @object
_main©variable_info.names.26:
        .string "_₃₅"
.size _main©variable_info.names.26, . - _main©variable_info.names.26

.data
.align 8
.type _main©variable_info.names.27, @object
_main©variable_info.names.27:
        .string "_₅"
.size _main©variable_info.names.27, . - _main©variable_info.names.27

.data
.align 8
.type _main©variable_info.names.28, @object
_main©variable_info.names.28:
        .string "_₂₆"
.size _main©variable_info.names.28, . - _main©variable_info.names.28

.data
.align 8
.type _main©variable_info.names.29, @object
_main©variable_info.names.29:
        .string "_₂₇"
.size _main©variable_info.names.29, . - _main©variable_info.names.29

.data
.align 8
.type _main©variable_info.names.30, @object
_main©variable_info.names.30:
        .string "_₂₈"
.size _main©variable_info.names.30, . - _main©variable_info.names.30

.data
.align 8
.type _main©variable_info.names.31, @object
_main©variable_info.names.31:
        .string "_₂₉"
.size _main©variable_info.names.31, . - _main©variable_info.names.31

.data
.align 8
.type _main©variable_info.names.32, @object
_main©variable_info.names.32:
        .string "_₁₇"
.size _main©variable_info.names.32, . - _main©variable_info.names.32

.data
.align 8
.type _main©variable_info.names.33, @object
_main©variable_info.names.33:
        .string "_₁₈"
.size _main©variable_info.names.33, . - _main©variable_info.names.33

.data
.align 8
.type _main©variable_info.names.34, @object
_main©variable_info.names.34:
        .string "_₁₉"
.size _main©variable_info.names.34, . - _main©variable_info.names.34

.data
.align 8
.type _main©variable_info.names.35, @object
_main©variable_info.names.35:
        .string "_₂₀"
.size _main©variable_info.names.35, . - _main©variable_info.names.35

.data
.align 8
.type _main©variable_info.names.36, @object
_main©variable_info.names.36:
        .string "_₂₁"
.size _main©variable_info.names.36, . - _main©variable_info.names.36

.data
.align 8
.type _main©variable_info.names.37, @object
_main©variable_info.names.37:
        .string "_₂₂"
.size _main©variable_info.names.37, . - _main©variable_info.names.37

.data
.align 8
.type _main©variable_info.names.38, @object
_main©variable_info.names.38:
        .string "_₆"
.size _main©variable_info.names.38, . - _main©variable_info.names.38

.data
.align 8
.type _main©variable_info.names.39, @object
_main©variable_info.names.39:
        .string "_₁₁"
.size _main©variable_info.names.39, . - _main©variable_info.names.39

.data
.align 8
.type _main©variable_info.names.40, @object
_main©variable_info.names.40:
        .string "_₁₂"
.size _main©variable_info.names.40, . - _main©variable_info.names.40

.data
.align 8
.type _main©variable_info.names.41, @object
_main©variable_info.names.41:
        .string "_₁₃"
.size _main©variable_info.names.41, . - _main©variable_info.names.41

.data
.align 8
.type _main©variable_info.names.42, @object
_main©variable_info.names.42:
        .string "_₁₄"
.size _main©variable_info.names.42, . - _main©variable_info.names.42

.data
.align 8
.type _main©variable_info.names.43, @object
_main©variable_info.names.43:
        .string "_₁₅"
.size _main©variable_info.names.43, . - _main©variable_info.names.43

.data
.align 8
.type _main©variable_info.names.44, @object
_main©variable_info.names.44:
        .string "_₁₆"
.size _main©variable_info.names.44, . - _main©variable_info.names.44

.data
.align 8
.type _main©setup©variable_info, @object
_main©setup©variable_info:
        .quad 4
        .quad _main©setup©variable_info.names
.size _main©setup©variable_info, . - _main©setup©variable_info

.data
.align 8
.type _main©setup©variable_info.names, @object
_main©setup©variable_info.names:
        .quad _main©setup©variable_info.names.0
        .quad _main©setup©variable_info.names.1
        .quad _main©setup©variable_info.names.2
        .quad _main©setup©variable_info.names.3
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
        .string "arity"
.size _main©setup©variable_info.names.1, . - _main©setup©variable_info.names.1

.data
.align 8
.type _main©setup©variable_info.names.2, @object
_main©setup©variable_info.names.2:
        .string "size"
.size _main©setup©variable_info.names.2, . - _main©setup©variable_info.names.2

.data
.align 8
.type _main©setup©variable_info.names.3, @object
_main©setup©variable_info.names.3:
        .string "curry"
.size _main©setup©variable_info.names.3, . - _main©setup©variable_info.names.3

.data
.align 8
.type equal_p©setup©variable_info, @object
equal_p©setup©variable_info:
        .quad 4
        .quad equal_p©setup©variable_info.names
.size equal_p©setup©variable_info, . - equal_p©setup©variable_info

.data
.align 8
.type equal_p©setup©variable_info.names, @object
equal_p©setup©variable_info.names:
        .quad equal_p©setup©variable_info.names.0
        .quad equal_p©setup©variable_info.names.1
        .quad equal_p©setup©variable_info.names.2
        .quad equal_p©setup©variable_info.names.3
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
        .string "arity"
.size equal_p©setup©variable_info.names.1, . - equal_p©setup©variable_info.names.1

.data
.align 8
.type equal_p©setup©variable_info.names.2, @object
equal_p©setup©variable_info.names.2:
        .string "size"
.size equal_p©setup©variable_info.names.2, . - equal_p©setup©variable_info.names.2

.data
.align 8
.type equal_p©setup©variable_info.names.3, @object
equal_p©setup©variable_info.names.3:
        .string "curry"
.size equal_p©setup©variable_info.names.3, . - equal_p©setup©variable_info.names.3

.data
.align 8
.type println_non_void©setup©variable_info, @object
println_non_void©setup©variable_info:
        .quad 4
        .quad println_non_void©setup©variable_info.names
.size println_non_void©setup©variable_info, . - println_non_void©setup©variable_info

.data
.align 8
.type println_non_void©setup©variable_info.names, @object
println_non_void©setup©variable_info.names:
        .quad println_non_void©setup©variable_info.names.0
        .quad println_non_void©setup©variable_info.names.1
        .quad println_non_void©setup©variable_info.names.2
        .quad println_non_void©setup©variable_info.names.3
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
        .string "arity"
.size println_non_void©setup©variable_info.names.1, . - println_non_void©setup©variable_info.names.1

.data
.align 8
.type println_non_void©setup©variable_info.names.2, @object
println_non_void©setup©variable_info.names.2:
        .string "size"
.size println_non_void©setup©variable_info.names.2, . - println_non_void©setup©variable_info.names.2

.data
.align 8
.type println_non_void©setup©variable_info.names.3, @object
println_non_void©setup©variable_info.names.3:
        .string "curry"
.size println_non_void©setup©variable_info.names.3, . - println_non_void©setup©variable_info.names.3

.data
.align 8
.type iadd©setup©variable_info, @object
iadd©setup©variable_info:
        .quad 4
        .quad iadd©setup©variable_info.names
.size iadd©setup©variable_info, . - iadd©setup©variable_info

.data
.align 8
.type iadd©setup©variable_info.names, @object
iadd©setup©variable_info.names:
        .quad iadd©setup©variable_info.names.0
        .quad iadd©setup©variable_info.names.1
        .quad iadd©setup©variable_info.names.2
        .quad iadd©setup©variable_info.names.3
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
        .string "arity"
.size iadd©setup©variable_info.names.1, . - iadd©setup©variable_info.names.1

.data
.align 8
.type iadd©setup©variable_info.names.2, @object
iadd©setup©variable_info.names.2:
        .string "size"
.size iadd©setup©variable_info.names.2, . - iadd©setup©variable_info.names.2

.data
.align 8
.type iadd©setup©variable_info.names.3, @object
iadd©setup©variable_info.names.3:
        .string "curry"
.size iadd©setup©variable_info.names.3, . - iadd©setup©variable_info.names.3

.data
.align 8
.type int_less_p©setup©variable_info, @object
int_less_p©setup©variable_info:
        .quad 4
        .quad int_less_p©setup©variable_info.names
.size int_less_p©setup©variable_info, . - int_less_p©setup©variable_info

.data
.align 8
.type int_less_p©setup©variable_info.names, @object
int_less_p©setup©variable_info.names:
        .quad int_less_p©setup©variable_info.names.0
        .quad int_less_p©setup©variable_info.names.1
        .quad int_less_p©setup©variable_info.names.2
        .quad int_less_p©setup©variable_info.names.3
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
        .string "arity"
.size int_less_p©setup©variable_info.names.1, . - int_less_p©setup©variable_info.names.1

.data
.align 8
.type int_less_p©setup©variable_info.names.2, @object
int_less_p©setup©variable_info.names.2:
        .string "size"
.size int_less_p©setup©variable_info.names.2, . - int_less_p©setup©variable_info.names.2

.data
.align 8
.type int_less_p©setup©variable_info.names.3, @object
int_less_p©setup©variable_info.names.3:
        .string "curry"
.size int_less_p©setup©variable_info.names.3, . - int_less_p©setup©variable_info.names.3

.data
.align 8
.type make_curry©setup©variable_info, @object
make_curry©setup©variable_info:
        .quad 4
        .quad make_curry©setup©variable_info.names
.size make_curry©setup©variable_info, . - make_curry©setup©variable_info

.data
.align 8
.type make_curry©setup©variable_info.names, @object
make_curry©setup©variable_info.names:
        .quad make_curry©setup©variable_info.names.0
        .quad make_curry©setup©variable_info.names.1
        .quad make_curry©setup©variable_info.names.2
        .quad make_curry©setup©variable_info.names.3
.size make_curry©setup©variable_info.names, . - make_curry©setup©variable_info.names

.data
.align 8
.type make_curry©setup©variable_info.names.0, @object
make_curry©setup©variable_info.names.0:
        .string "address"
.size make_curry©setup©variable_info.names.0, . - make_curry©setup©variable_info.names.0

.data
.align 8
.type make_curry©setup©variable_info.names.1, @object
make_curry©setup©variable_info.names.1:
        .string "arity"
.size make_curry©setup©variable_info.names.1, . - make_curry©setup©variable_info.names.1

.data
.align 8
.type make_curry©setup©variable_info.names.2, @object
make_curry©setup©variable_info.names.2:
        .string "size"
.size make_curry©setup©variable_info.names.2, . - make_curry©setup©variable_info.names.2

.data
.align 8
.type make_curry©setup©variable_info.names.3, @object
make_curry©setup©variable_info.names.3:
        .string "curry"
.size make_curry©setup©variable_info.names.3, . - make_curry©setup©variable_info.names.3

.data
.align 8
.type random_dice©setup©variable_info, @object
random_dice©setup©variable_info:
        .quad 4
        .quad random_dice©setup©variable_info.names
.size random_dice©setup©variable_info, . - random_dice©setup©variable_info

.data
.align 8
.type random_dice©setup©variable_info.names, @object
random_dice©setup©variable_info.names:
        .quad random_dice©setup©variable_info.names.0
        .quad random_dice©setup©variable_info.names.1
        .quad random_dice©setup©variable_info.names.2
        .quad random_dice©setup©variable_info.names.3
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
        .string "arity"
.size random_dice©setup©variable_info.names.1, . - random_dice©setup©variable_info.names.1

.data
.align 8
.type random_dice©setup©variable_info.names.2, @object
random_dice©setup©variable_info.names.2:
        .string "size"
.size random_dice©setup©variable_info.names.2, . - random_dice©setup©variable_info.names.2

.data
.align 8
.type random_dice©setup©variable_info.names.3, @object
random_dice©setup©variable_info.names.3:
        .string "curry"
.size random_dice©setup©variable_info.names.3, . - random_dice©setup©variable_info.names.3

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
