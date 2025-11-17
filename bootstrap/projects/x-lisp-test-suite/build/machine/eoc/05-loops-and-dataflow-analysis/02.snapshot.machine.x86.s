
.text
_main:
_main.body:
        leaq x_println_non_void(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        leaq x_print(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        movq $8, -80(%rbp)
        movq -72(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        leaq x_newline(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        leaq x_print(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -112(%rbp)
        movq $16, -120(%rbp)
        movq -112(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        leaq x_newline(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -136(%rbp)
        movq -136(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -144(%rbp)
        leaq x_print(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -152(%rbp)
        movq $24, -160(%rbp)
        movq -152(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        leaq x_newline(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -176(%rbp)
        movq -176(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -184(%rbp)
        movq $48, -192(%rbp)
        leaq x_print(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -200(%rbp)
        movq $32, -208(%rbp)
        movq -200(%rbp), %rdi
        movq -208(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        leaq x_newline(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -216(%rbp)
        movq -216(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        leaq x_print(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -224(%rbp)
        movq $40, -232(%rbp)
        movq -224(%rbp), %rdi
        movq -232(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        leaq x_newline(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -240(%rbp)
        movq -240(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -144(%rbp)
        leaq x_print(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -248(%rbp)
        movq $48, -256(%rbp)
        movq -248(%rbp), %rdi
        movq -256(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        leaq x_newline(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -264(%rbp)
        movq -264(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -184(%rbp)
        leaq x_iadd(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -272(%rbp)
        movq -272(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -280(%rbp)
        movq -280(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -288(%rbp)
        movq -64(%rbp), %rdi
        movq -288(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -296(%rbp)
        movq -296(%rbp), %rax
        retq 
