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
        subq $200, %rsp
        jmp _main.body
_main.body:
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
        je _main.main.then₅
        jmp _main.main.else₆
_main.main.let_body₁:
        movq -64(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq -128(%rbp), %rax
        jmp _main.epilog
_main.main.then₂:
        movq $0, -136(%rbp)
        movq -136(%rbp), %rdi
        callq x_identity
        movq %rax, -120(%rbp)
        jmp _main.main.let_body₁
_main.main.else₃:
        movq $336, -144(%rbp)
        movq -144(%rbp), %rdi
        callq x_identity
        movq %rax, -120(%rbp)
        jmp _main.main.let_body₁
_main.main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -152(%rbp), %rax
        je _main.main.then₂
        jmp _main.main.else₃
_main.main.then₅:
        leaq x_equal_p(%rip), %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -160(%rbp)
        leaq x_random_dice(%rip), %rdi
        orq $3, %rdi
        movq $0, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -168(%rbp)
        movq -168(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -176(%rbp)
        movq -160(%rbp), %rdi
        movq -176(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq $16, -192(%rbp)
        movq -184(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        jmp _main.main.let_body₄
_main.main.else₆:
        movq x_false(%rip), %rax
        movq %rax, -200(%rbp)
        movq -200(%rbp), %rdi
        callq x_identity
        movq %rax, -152(%rbp)
        jmp _main.main.let_body₄
_main.epilog:
        addq $200, %rsp
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
