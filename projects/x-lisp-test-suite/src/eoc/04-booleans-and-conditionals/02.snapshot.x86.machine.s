.global __setup
.global __main

.text
.align 8
.type __main, @function
__main:
__main.prolog:
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
        jmp __main.body
__main.body:
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
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -104(%rbp)
        movq $x_int_less_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        je __main._main.then₁₁
        jmp __main._main.else₁₂
__main._main.let_body₁:
        movq -144(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -64(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq -168(%rbp), %rax
        jmp __main.epilog
__main._main.then₂:
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
        movq $16, -192(%rbp)
        movq -184(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        jmp __main._main.let_body₁
__main._main.else₃:
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        jmp __main._main.let_body₁
__main._main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -224(%rbp), %rax
        je __main._main.then₂
        jmp __main._main.else₃
__main._main.then₅:
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
        movq $0, -248(%rbp)
        movq -240(%rbp), %rdi
        movq -248(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -224(%rbp)
        jmp __main._main.let_body₄
__main._main.else₆:
        movq $x_equal_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        jmp __main._main.let_body₄
__main._main.let_body₇:
        movq -104(%rbp), %rdi
        movq -280(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq $x_int_less_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        je __main._main.then₅
        jmp __main._main.else₆
__main._main.then₈:
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        jmp __main._main.let_body₇
__main._main.else₉:
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        jmp __main._main.let_body₇
__main._main.let_body₁₀:
        movq x_true(%rip), %rax
        cmpq -368(%rbp), %rax
        je __main._main.then₈
        jmp __main._main.else₉
__main._main.then₁₁:
        movq $x_equal_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        jmp __main._main.let_body₁₀
__main._main.else₁₂:
        movq $x_equal_p, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
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
        jmp __main._main.let_body₁₀
__main.epilog:
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
.size __main, . - __main

.bss
.align 8
___main.constant:
        .zero 8

.text
.align 8
.type ___main.setup, @function
___main.setup:
___main.setup.prolog:
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
        jmp ___main.setup.body
___main.setup.body:
        movq $__main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $0, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, ___main.constant(%rip)
        jmp ___main.setup.epilog
___main.setup.epilog:
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
.size ___main.setup, . - ___main.setup

.text
.align 8
.type __setup, @function
__setup:
__setup.prolog:
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
        jmp __setup.body
__setup.body:
        callq ___main.setup
        movq %rax, -64(%rbp)
__setup.epilog:
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
.size __setup, . - __setup
