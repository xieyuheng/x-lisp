
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
        leaq x_ineg(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -72(%rbp)
        leaq x_random_dice(%rip), %rdi
        salq $3, %rdi
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
        movq -64(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -104(%rbp)
        movq -104(%rbp), %rax
        retq 
