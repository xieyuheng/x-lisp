
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
        movq $8, -72(%rbp)
        movq $336, -80(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq $56, -104(%rbp)
        movq -96(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rdi
        callq identity
        movq %rax, -120(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -128(%rbp)
        movq -128(%rbp), %rdi
        movq -112(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq -136(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -152(%rbp)
        movq -152(%rbp), %rdi
        movq -144(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        leaq x_ineg(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -168(%rbp)
        movq -168(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -176(%rbp)
        movq -160(%rbp), %rdi
        movq -176(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq -64(%rbp), %rdi
        movq -184(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -192(%rbp)
        movq -192(%rbp), %rax
        retq 
