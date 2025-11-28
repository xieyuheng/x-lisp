.global __setup
.global __main

.bss
.align 8
_one:
        .zero 8

.bss
.align 8
__one.flag:
        .zero 8

.text
.align 8
.type __one.flag_setup, @function
__one.flag_setup:
__one.flag_setup.prolog:
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
        jmp __one.flag_setup.body
__one.flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, __one.flag(%rip)
        jmp __one.flag_setup.epilog
__one.flag_setup.epilog:
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
.size __one.flag_setup, . - __one.flag_setup

.text
.align 8
.type __one.get, @function
__one.get:
__one.get.prolog:
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
        jmp __one.get.body
__one.get.body:
        movq __one.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je __one.get.cached
        jmp __one.get.init
__one.get.cached:
        movq _one(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp __one.get.epilog
__one.get.init:
        callq __one.init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, _one(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, __one.flag(%rip)
        movq -72(%rbp), %rax
        jmp __one.get.epilog
__one.get.epilog:
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
.size __one.get, . - __one.get

.text
.align 8
.type __one.init_function, @function
__one.init_function:
__one.init_function.prolog:
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
        jmp __one.init_function.body
__one.init_function.body:
        movq $8, -64(%rbp)
        movq -64(%rbp), %rax
        jmp __one.init_function.epilog
__one.init_function.epilog:
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
.size __one.init_function, . - __one.init_function

.bss
.align 8
_two:
        .zero 8

.bss
.align 8
__two.flag:
        .zero 8

.text
.align 8
.type __two.flag_setup, @function
__two.flag_setup:
__two.flag_setup.prolog:
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
        jmp __two.flag_setup.body
__two.flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, __two.flag(%rip)
        jmp __two.flag_setup.epilog
__two.flag_setup.epilog:
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
.size __two.flag_setup, . - __two.flag_setup

.text
.align 8
.type __two.get, @function
__two.get:
__two.get.prolog:
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
        jmp __two.get.body
__two.get.body:
        movq __two.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je __two.get.cached
        jmp __two.get.init
__two.get.cached:
        movq _two(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp __two.get.epilog
__two.get.init:
        callq __two.init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, _two(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, __two.flag(%rip)
        movq -72(%rbp), %rax
        jmp __two.get.epilog
__two.get.epilog:
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
.size __two.get, . - __two.get

.text
.align 8
.type __two.init_function, @function
__two.init_function:
__two.init_function.prolog:
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
        jmp __two.init_function.body
__two.init_function.body:
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        movq $8, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        callq __one.get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp __two.init_function.epilog
__two.init_function.epilog:
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
.size __two.init_function, . - __two.init_function

.bss
.align 8
_three:
        .zero 8

.bss
.align 8
__three.flag:
        .zero 8

.text
.align 8
.type __three.flag_setup, @function
__three.flag_setup:
__three.flag_setup.prolog:
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
        jmp __three.flag_setup.body
__three.flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, __three.flag(%rip)
        jmp __three.flag_setup.epilog
__three.flag_setup.epilog:
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
.size __three.flag_setup, . - __three.flag_setup

.text
.align 8
.type __three.get, @function
__three.get:
__three.get.prolog:
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
        jmp __three.get.body
__three.get.body:
        movq __three.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je __three.get.cached
        jmp __three.get.init
__three.get.cached:
        movq _three(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp __three.get.epilog
__three.get.init:
        callq __three.init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, _three(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, __three.flag(%rip)
        movq -72(%rbp), %rax
        jmp __three.get.epilog
__three.get.epilog:
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
.size __three.get, . - __three.get

.text
.align 8
.type __three.init_function, @function
__three.init_function:
__three.init_function.prolog:
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
        jmp __three.init_function.body
__three.init_function.body:
        movq $x_iadd, %rdi
        orq $3, %rdi
        movq $16, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        movq $8, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        callq __two.get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp __three.init_function.epilog
__three.init_function.epilog:
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
.size __three.init_function, . - __three.init_function

.text
.align 8
.type __main, @function
__main:
__main.prolog:
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
        jmp __main.body
__main.body:
        movq $x_println_non_void, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        callq __three.get
        movq %rax, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        jmp __main.epilog
__main.epilog:
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
.size __main, . - __main

.bss
.align 8
___main.constant:
        .zero 8

.text
.align 8
.type ___main.setup, @function
___main.setup:
___main.setup.prolog:
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
        jmp ___main.setup.body
___main.setup.body:
        movq $__main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $0, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, ___main.constant(%rip)
        jmp ___main.setup.epilog
___main.setup.epilog:
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
.size ___main.setup, . - ___main.setup

.text
.align 8
.type __setup, @function
__setup:
__setup.prolog:
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
        jmp __setup.body
__setup.body:
        callq __one.flag_setup
        movq %rax, -64(%rbp)
        callq __two.flag_setup
        movq %rax, -64(%rbp)
        callq __three.flag_setup
        movq %rax, -64(%rbp)
        callq ___main.setup
        movq %rax, -64(%rbp)
__setup.epilog:
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
.size __setup, . - __setup
