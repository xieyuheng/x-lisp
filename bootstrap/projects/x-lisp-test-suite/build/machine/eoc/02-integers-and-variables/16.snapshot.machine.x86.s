.global _main

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
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        leaq x_isub(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        movq $400, -80(%rbp)
        movq -72(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq $64, -96(%rbp)
        movq -88(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -104(%rbp)
        movq -64(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rax
        jmp _main.epilog
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
