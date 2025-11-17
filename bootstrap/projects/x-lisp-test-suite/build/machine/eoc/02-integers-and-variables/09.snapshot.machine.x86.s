
.text
_main:
_main.entry:
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
        movq $160, -80(%rbp)
        movq -72(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -96(%rbp)
        movq $88, -104(%rbp)
        movq -96(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq $88, -120(%rbp)
        movq -112(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq -88(%rbp), %rdi
        movq -128(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq -64(%rbp), %rdi
        movq -136(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq -144(%rbp), %rax
        retq 
