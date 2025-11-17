
.text
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
        subq $56, %rsp
        jmp _main.body
_main.body:
        leaq x_println_non_void(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        movq $8, -72(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq $40, -96(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -104(%rbp)
        movq -104(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -128(%rbp)
        movq -128(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq $800, -144(%rbp)
        movq -136(%rbp), %rdi
        movq -144(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        movq -88(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -64(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq -168(%rbp), %rax
        retq 
_main.epilog:
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
