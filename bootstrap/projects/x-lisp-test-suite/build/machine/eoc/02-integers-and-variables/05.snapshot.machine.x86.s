
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), %rdi
        salq $3, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, @(var _₁)
        movq $336, @(var a₁)
        movq @(var a₁), %rdi
        callq identity
        movq %rax, @(var b₁)
        movq @(var _₁), %rdi
        movq @(var b₁), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
