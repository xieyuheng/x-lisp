
.text
_main:
_main.entry:
        leaq _x_println_non_void(%rip), @(var _₁)
        movq $42, @(var a₁)
        movq @(var a₁), %rdi
        callq _identity
        movq %rax, @(var b₁)
        movq @(var _₁), %rdi
        movq @(var b₁), %rsi
        callq _x_apply_unary
        movq %rax, @(var _↩)
        movq @(var _↩), %rax
        retq 
