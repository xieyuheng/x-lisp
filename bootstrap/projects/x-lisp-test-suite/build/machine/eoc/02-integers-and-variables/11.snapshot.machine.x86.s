
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
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -80(%rbp)
        movq $8, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq $16, -104(%rbp)
        movq -96(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq -72(%rbp), %rdi
        movq -112(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -128(%rbp)
        movq $24, -136(%rbp)
        movq -128(%rbp), %rdi
        movq -136(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq $32, -152(%rbp)
        movq -144(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -120(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq -64(%rbp), %rdi
        movq -168(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -176(%rbp)
        movq -176(%rbp), %rax
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
