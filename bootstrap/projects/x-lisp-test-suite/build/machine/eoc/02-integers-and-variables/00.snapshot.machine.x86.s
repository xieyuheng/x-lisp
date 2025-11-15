
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        movq $42, @(var _₂)
        movq @(var _₁), %rdi
        movq @(var _₂), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
