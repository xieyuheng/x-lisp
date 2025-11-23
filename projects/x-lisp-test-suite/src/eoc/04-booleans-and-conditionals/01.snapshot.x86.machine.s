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
        subq $248, %rsp
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
        leaq x_int_less_p(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -104(%rbp)
        movq -104(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq $8, -120(%rbp)
        movq -112(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq x_true(%rip), %rax
        cmpq -128(%rbp), %rax
        je _main.main.then₅
        jmp _main.main.else₆
_main.main.let_body₁:
        movq -64(%rbp), %rdi
        movq -136(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -144(%rbp)
        movq -144(%rbp), %rax
        jmp _main.epilog
_main.main.then₂:
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -152(%rbp)
        movq -152(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq $16, -168(%rbp)
        movq -160(%rbp), %rdi
        movq -168(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        jmp _main.main.let_body₁
_main.main.else₃:
        leaq x_iadd(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -176(%rbp)
        movq -176(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq $80, -192(%rbp)
        movq -184(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -200(%rbp), %rax
        je _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq x_equal_p(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -208(%rbp)
        movq -208(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -216(%rbp)
        movq $0, -224(%rbp)
        movq -216(%rbp), %rdi
        movq -224(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -200(%rbp)
        jmp _main.main.let_body₄
_main.main.else₆:
        leaq x_equal_p(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -232(%rbp)
        movq -232(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -240(%rbp)
        movq $16, -248(%rbp)
        movq -240(%rbp), %rdi
        movq -248(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -200(%rbp)
        jmp _main.main.let_body₄
_main.epilog:
        addq $248, %rsp
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

