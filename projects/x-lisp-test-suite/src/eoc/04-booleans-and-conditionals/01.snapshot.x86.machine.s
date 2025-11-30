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
.size _main©metadata, . - _main©metadata

.data
.align 8
.type _main©metadata.name, @object
_main©metadata.name:
        .string "_main"
.size _main©metadata.name, . - _main©metadata.name

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
.size make_curry©metadata, . - make_curry©metadata

.data
.align 8
.type make_curry©metadata.name, @object
make_curry©metadata.name:
        .string "make-curry"
.size make_curry©metadata.name, . - make_curry©metadata.name

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
