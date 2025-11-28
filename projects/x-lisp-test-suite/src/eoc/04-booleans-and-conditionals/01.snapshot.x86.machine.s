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
        movq $x_println_non_void, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        movq $x_random_dice, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -80(%rbp)
        movq $x_random_dice, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -96(%rbp)
        movq $x_int_less_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        movq $x_equal_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        movq $x_equal_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
