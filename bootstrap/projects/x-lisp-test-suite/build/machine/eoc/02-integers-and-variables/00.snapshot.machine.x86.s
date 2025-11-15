
.text
_main:
_main.entry:
        leaq x_println_non_void(%rip), @(var _₁)
        movq $42, @(var _₂)
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
