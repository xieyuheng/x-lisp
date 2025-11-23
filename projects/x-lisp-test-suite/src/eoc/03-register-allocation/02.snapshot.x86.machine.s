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
        subq $160, %rsp
        jmp _main.body
_main.body:
        leaq x_println_non_void(%rip), %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        leaq x_random_dice(%rip), %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -80(%rbp)
        leaq x_random_dice(%rip), %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -96(%rbp)
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -104(%rbp)
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        movq -120(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq -104(%rbp), %rdi
        movq -128(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq $336, -144(%rbp)
        movq -136(%rbp), %rdi
        movq -144(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        movq -64(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -160(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $160, %rsp
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

