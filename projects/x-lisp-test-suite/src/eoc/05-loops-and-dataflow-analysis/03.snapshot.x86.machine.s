.global _setup
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
        subq $352, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -64(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -72(%rbp)
        movq $8, -80(%rbp)
        movq -72(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -112(%rbp)
        movq $16, -120(%rbp)
        movq -112(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -136(%rbp)
        movq -136(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -144(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -152(%rbp)
        movq $24, -160(%rbp)
        movq -152(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -176(%rbp)
        movq -176(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -184(%rbp)
        movq equal_p©constant(%rip), %rax
        movq %rax, -192(%rbp)
        movq $8, -200(%rbp)
        movq -192(%rbp), %rdi
        movq -200(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -208(%rbp)
        movq $16, -216(%rbp)
        movq -208(%rbp), %rdi
        movq -216(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -224(%rbp)
        movq x_true(%rip), %rax
        cmpq -224(%rbp), %rax
        je _main._main.then₂
        jmp _main._main.else₃
_main._main.let_body₁:
        movq -64(%rbp), %rdi
        movq -232(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -240(%rbp)
        movq -240(%rbp), %rax
        jmp _main.epilog
_main._main.then₂:
        movq print©constant(%rip), %rax
        movq %rax, -248(%rbp)
        movq $888, -256(%rbp)
        movq -248(%rbp), %rdi
        movq -256(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -264(%rbp)
        movq -264(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        movq equal_p©constant(%rip), %rax
        movq %rax, -272(%rbp)
        movq $8, -280(%rbp)
        movq -272(%rbp), %rdi
        movq -280(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -288(%rbp)
        movq $16, -296(%rbp)
        movq -288(%rbp), %rdi
        movq -296(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -232(%rbp)
        jmp _main._main.let_body₁
_main._main.else₃:
        movq print©constant(%rip), %rax
        movq %rax, -304(%rbp)
        movq $1776, -312(%rbp)
        movq -304(%rbp), %rdi
        movq -312(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -320(%rbp)
        movq -320(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        movq equal_p©constant(%rip), %rax
        movq %rax, -328(%rbp)
        movq $8, -336(%rbp)
        movq -328(%rbp), %rdi
        movq -336(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -344(%rbp)
        movq $16, -352(%rbp)
        movq -344(%rbp), %rdi
        movq -352(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -232(%rbp)
        jmp _main._main.let_body₁
_main.epilog:
        addq $352, %rsp
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

.bss
.align 8
_main©constant:
        .zero 8

.text
.align 8
.type _main©setup, @function
_main©setup:
_main©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp _main©setup.body
_main©setup.body:
        movq $_main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $0, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, _main©constant(%rip)
        jmp _main©setup.epilog
_main©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _main©setup, . - _main©setup

.bss
.align 8
equal_p©constant:
        .zero 8

.text
.align 8
.type equal_p©setup, @function
equal_p©setup:
equal_p©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp equal_p©setup.body
equal_p©setup.body:
        movq $x_equal_p, -64(%rbp)
        orq $3, -64(%rbp)
        movq $16, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, equal_p©constant(%rip)
        jmp equal_p©setup.epilog
equal_p©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size equal_p©setup, . - equal_p©setup

.bss
.align 8
print©constant:
        .zero 8

.text
.align 8
.type print©setup, @function
print©setup:
print©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp print©setup.body
print©setup.body:
        movq $x_print, -64(%rbp)
        orq $3, -64(%rbp)
        movq $8, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, print©constant(%rip)
        jmp print©setup.epilog
print©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size print©setup, . - print©setup

.bss
.align 8
println_non_void©constant:
        .zero 8

.text
.align 8
.type println_non_void©setup, @function
println_non_void©setup:
println_non_void©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp println_non_void©setup.body
println_non_void©setup.body:
        movq $x_println_non_void, -64(%rbp)
        orq $3, -64(%rbp)
        movq $8, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, println_non_void©constant(%rip)
        jmp println_non_void©setup.epilog
println_non_void©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size println_non_void©setup, . - println_non_void©setup

.bss
.align 8
newline©constant:
        .zero 8

.text
.align 8
.type newline©setup, @function
newline©setup:
newline©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp newline©setup.body
newline©setup.body:
        movq $x_newline, -64(%rbp)
        orq $3, -64(%rbp)
        movq $0, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, newline©constant(%rip)
        jmp newline©setup.epilog
newline©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size newline©setup, . - newline©setup

.bss
.align 8
make_curry©constant:
        .zero 8

.text
.align 8
.type make_curry©setup, @function
make_curry©setup:
make_curry©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp make_curry©setup.body
make_curry©setup.body:
        movq $x_make_curry, -64(%rbp)
        orq $3, -64(%rbp)
        movq $24, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, make_curry©constant(%rip)
        jmp make_curry©setup.epilog
make_curry©setup.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size make_curry©setup, . - make_curry©setup

.text
.align 8
.type _setup, @function
_setup:
_setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $64, %rsp
        jmp _setup.body
_setup.body:
        callq _main©setup
        movq %rax, -64(%rbp)
        callq equal_p©setup
        movq %rax, -64(%rbp)
        callq print©setup
        movq %rax, -64(%rbp)
        callq println_non_void©setup
        movq %rax, -64(%rbp)
        callq newline©setup
        movq %rax, -64(%rbp)
        callq make_curry©setup
        movq %rax, -64(%rbp)
_setup.epilog:
        addq $64, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _setup, . - _setup
