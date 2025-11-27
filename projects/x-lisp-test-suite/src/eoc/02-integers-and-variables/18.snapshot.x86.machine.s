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
        subq $216, %rsp
        jmp __main.body
__main.body:
        leaq x_println_non_void(%rip), %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -80(%rbp)
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -96(%rbp)
        leaq x_random_dice(%rip), %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -104(%rbp)
        movq -104(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -112(%rbp)
        movq -96(%rbp), %rdi
        movq -112(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        movq $8, -128(%rbp)
        movq -120(%rbp), %rdi
        movq -128(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq -88(%rbp), %rdi
        movq -136(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq $8, -152(%rbp)
        movq -144(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -80(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq $8, -176(%rbp)
        movq -168(%rbp), %rdi
        movq -176(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq -72(%rbp), %rdi
        movq -184(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -192(%rbp)
        movq $8, -200(%rbp)
        movq -192(%rbp), %rdi
        movq -200(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -208(%rbp)
        movq -64(%rbp), %rdi
        movq -208(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -216(%rbp)
        movq -216(%rbp), %rax
        jmp __main.epilog
__main.epilog:
        addq $216, %rsp
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
