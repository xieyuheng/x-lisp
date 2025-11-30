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
        subq $296, %rsp
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
        movq $48, -192(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -200(%rbp)
        movq $32, -208(%rbp)
        movq -200(%rbp), %rdi
        movq -208(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -216(%rbp)
        movq -216(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -224(%rbp)
        movq $40, -232(%rbp)
        movq -224(%rbp), %rdi
        movq -232(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -240(%rbp)
        movq -240(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -144(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -248(%rbp)
        movq $48, -256(%rbp)
        movq -248(%rbp), %rdi
        movq -256(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -264(%rbp)
        movq -264(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -184(%rbp)
        movq iadd©constant(%rip), %rax
        movq %rax, -272(%rbp)
        movq -272(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -280(%rbp)
        movq -280(%rbp), %rdi
        movq -192(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -288(%rbp)
        movq -64(%rbp), %rdi
        movq -288(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -296(%rbp)
        movq -296(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $296, %rsp
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

.data
.align 8
.type _main©metadata, @object
_main©metadata:
        .quad _main©metadata©name
        .quad 0
        .quad 0
.size _main©metadata, . - _main©metadata

.data
.align 8
.type _main©metadata©name, @object
_main©metadata©name:
        .string "_main"
.size _main©metadata©name, . - _main©metadata©name

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

.data
.align 8
.type print©metadata, @object
print©metadata:
        .quad print©metadata©name
        .quad 1
        .quad 1
.size print©metadata, . - print©metadata

.data
.align 8
.type print©metadata©name, @object
print©metadata©name:
        .string "print"
.size print©metadata©name, . - print©metadata©name

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

.data
.align 8
.type println_non_void©metadata, @object
println_non_void©metadata:
        .quad println_non_void©metadata©name
        .quad 1
        .quad 1
.size println_non_void©metadata, . - println_non_void©metadata

.data
.align 8
.type println_non_void©metadata©name, @object
println_non_void©metadata©name:
        .string "println-non-void"
.size println_non_void©metadata©name, . - println_non_void©metadata©name

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

.data
.align 8
.type newline©metadata, @object
newline©metadata:
        .quad newline©metadata©name
        .quad 0
        .quad 1
.size newline©metadata, . - newline©metadata

.data
.align 8
.type newline©metadata©name, @object
newline©metadata©name:
        .string "newline"
.size newline©metadata©name, . - newline©metadata©name

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

.data
.align 8
.type iadd©metadata, @object
iadd©metadata:
        .quad iadd©metadata©name
        .quad 2
        .quad 1
.size iadd©metadata, . - iadd©metadata

.data
.align 8
.type iadd©metadata©name, @object
iadd©metadata©name:
        .string "iadd"
.size iadd©metadata©name, . - iadd©metadata©name

.bss
.align 8
iadd©constant:
        .zero 8

.text
.align 8
.type iadd©setup, @function
iadd©setup:
iadd©setup.prolog:
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
        jmp iadd©setup.body
iadd©setup.body:
        movq $x_iadd, -64(%rbp)
        orq $3, -64(%rbp)
        movq $16, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, iadd©constant(%rip)
        jmp iadd©setup.epilog
iadd©setup.epilog:
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
.size iadd©setup, . - iadd©setup

.data
.align 8
.type make_curry©metadata, @object
make_curry©metadata:
        .quad make_curry©metadata©name
        .quad 3
        .quad 1
.size make_curry©metadata, . - make_curry©metadata

.data
.align 8
.type make_curry©metadata©name, @object
make_curry©metadata©name:
        .string "make-curry"
.size make_curry©metadata©name, . - make_curry©metadata©name

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
        callq print©setup
        movq %rax, -64(%rbp)
        callq println_non_void©setup
        movq %rax, -64(%rbp)
        callq newline©setup
        movq %rax, -64(%rbp)
        callq iadd©setup
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
