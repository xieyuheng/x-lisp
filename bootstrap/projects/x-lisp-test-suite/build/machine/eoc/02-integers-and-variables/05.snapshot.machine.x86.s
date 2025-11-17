
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
        movq $336, -72(%rbp)
        movq -72(%rbp), %rdi
        callq identity
        movq %rax, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        retq 
