
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
        movq $336, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        retq 
