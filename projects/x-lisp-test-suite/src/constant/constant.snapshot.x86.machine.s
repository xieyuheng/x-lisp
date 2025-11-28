.global _setup
.global _main

.bss
.align 8
one:
        .zero 8

.bss
.align 8
one©flag:
        .zero 8

.text
.align 8
.type one©flag_setup, @function
one©flag_setup:
one©flag_setup.prolog:
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
        jmp one©flag_setup.body
one©flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, one©flag(%rip)
        jmp one©flag_setup.epilog
one©flag_setup.epilog:
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
.size one©flag_setup, . - one©flag_setup

.text
.align 8
.type one©get, @function
one©get:
one©get.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp one©get.body
one©get.body:
        movq one©flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je one©get.cached
        jmp one©get.init
one©get.cached:
        movq one(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp one©get.epilog
one©get.init:
        callq one©init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, one(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, one©flag(%rip)
        movq -72(%rbp), %rax
        jmp one©get.epilog
one©get.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size one©get, . - one©get

.text
.align 8
.type one©init_function, @function
one©init_function:
one©init_function.prolog:
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
        jmp one©init_function.body
one©init_function.body:
        movq $8, -64(%rbp)
        movq -64(%rbp), %rax
        jmp one©init_function.epilog
one©init_function.epilog:
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
.size one©init_function, . - one©init_function

.bss
.align 8
two:
        .zero 8

.bss
.align 8
two©flag:
        .zero 8

.text
.align 8
.type two©flag_setup, @function
two©flag_setup:
two©flag_setup.prolog:
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
        jmp two©flag_setup.body
two©flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, two©flag(%rip)
        jmp two©flag_setup.epilog
two©flag_setup.epilog:
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
.size two©flag_setup, . - two©flag_setup

.text
.align 8
.type two©get, @function
two©get:
two©get.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp two©get.body
two©get.body:
        movq two©flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je two©get.cached
        jmp two©get.init
two©get.cached:
        movq two(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp two©get.epilog
two©get.init:
        callq two©init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, two(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, two©flag(%rip)
        movq -72(%rbp), %rax
        jmp two©get.epilog
two©get.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size two©get, . - two©get

.text
.align 8
.type two©init_function, @function
two©init_function:
two©init_function.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $96, %rsp
        jmp two©init_function.body
two©init_function.body:
        movq iadd©constant(%rip), %rax
        movq %rax, -64(%rbp)
        movq $8, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        callq one©get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp two©init_function.epilog
two©init_function.epilog:
        addq $96, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size two©init_function, . - two©init_function

.bss
.align 8
three:
        .zero 8

.bss
.align 8
three©flag:
        .zero 8

.text
.align 8
.type three©flag_setup, @function
three©flag_setup:
three©flag_setup.prolog:
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
        jmp three©flag_setup.body
three©flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, three©flag(%rip)
        jmp three©flag_setup.epilog
three©flag_setup.epilog:
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
.size three©flag_setup, . - three©flag_setup

.text
.align 8
.type three©get, @function
three©get:
three©get.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp three©get.body
three©get.body:
        movq three©flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je three©get.cached
        jmp three©get.init
three©get.cached:
        movq three(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp three©get.epilog
three©get.init:
        callq three©init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, three(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, three©flag(%rip)
        movq -72(%rbp), %rax
        jmp three©get.epilog
three©get.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size three©get, . - three©get

.text
.align 8
.type three©init_function, @function
three©init_function:
three©init_function.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $96, %rsp
        jmp three©init_function.body
three©init_function.body:
        movq iadd©constant(%rip), %rax
        movq %rax, -64(%rbp)
        movq $8, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        callq two©get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp three©init_function.epilog
three©init_function.epilog:
        addq $96, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size three©init_function, . - three©init_function

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
        subq $80, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -64(%rbp)
        callq three©get
        movq %rax, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $80, %rsp
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
        callq one©flag_setup
        movq %rax, -64(%rbp)
        callq two©flag_setup
        movq %rax, -64(%rbp)
        callq three©flag_setup
        movq %rax, -64(%rbp)
        callq _main©setup
        movq %rax, -64(%rbp)
        callq println_non_void©setup
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
