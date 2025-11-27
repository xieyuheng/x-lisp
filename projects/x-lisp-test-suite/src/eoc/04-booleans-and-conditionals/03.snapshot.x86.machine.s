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
        subq $176, %rsp
        jmp __main.body
__main.body:
        leaq x_println_non_void(%rip), %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        leaq x_equal_p(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        leaq x_random_dice(%rip), %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -88(%rbp)
        movq -72(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq $8, -104(%rbp)
        movq -96(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq x_true(%rip), %rax
        cmpq -112(%rbp), %rax
        je __main._main.then₅
        jmp __main._main.else₆
__main._main.let_body₁:
        movq -64(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq -128(%rbp), %rax
        jmp __main.epilog
__main._main.then₂:
        movq $0, -120(%rbp)
        jmp __main._main.let_body₁
__main._main.else₃:
        movq $336, -120(%rbp)
        jmp __main._main.let_body₁
__main._main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -136(%rbp), %rax
        je __main._main.then₂
        jmp __main._main.else₃
__main._main.then₅:
        leaq x_equal_p(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -144(%rbp)
        leaq x_random_dice(%rip), %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -152(%rbp)
        movq -152(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -160(%rbp)
        movq -144(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq $16, -176(%rbp)
        movq -168(%rbp), %rdi
        movq -176(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        jmp __main._main.let_body₄
__main._main.else₆:
        movq x_false(%rip), %rax
        movq %rax, -136(%rbp)
        jmp __main._main.let_body₄
__main.epilog:
        addq $176, %rsp
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
        subq $56, %rsp
        jmp __setup.body
__setup.body:

__setup.epilog:
        addq $56, %rsp
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
