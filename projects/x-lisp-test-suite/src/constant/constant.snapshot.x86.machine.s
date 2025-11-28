.global _setup
.global _main

.bss
.align 8
one:
        .zero 8

.bss
.align 8
_one.flag:
        .zero 8

.text
.align 8
.type _one.flag_setup, @function
_one.flag_setup:
_one.flag_setup.prolog:
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
        jmp _one.flag_setup.body
_one.flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, _one.flag(%rip)
        jmp _one.flag_setup.epilog
_one.flag_setup.epilog:
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
.size _one.flag_setup, . - _one.flag_setup

.text
.align 8
.type _one.get, @function
_one.get:
_one.get.prolog:
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
        jmp _one.get.body
_one.get.body:
        movq _one.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je _one.get.cached
        jmp _one.get.init
_one.get.cached:
        movq one(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _one.get.epilog
_one.get.init:
        callq _one.init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, one(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _one.flag(%rip)
        movq -72(%rbp), %rax
        jmp _one.get.epilog
_one.get.epilog:
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
.size _one.get, . - _one.get

.text
.align 8
.type _one.init_function, @function
_one.init_function:
_one.init_function.prolog:
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
        jmp _one.init_function.body
_one.init_function.body:
        movq $8, -64(%rbp)
        movq -64(%rbp), %rax
        jmp _one.init_function.epilog
_one.init_function.epilog:
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
.size _one.init_function, . - _one.init_function

.bss
.align 8
two:
        .zero 8

.bss
.align 8
_two.flag:
        .zero 8

.text
.align 8
.type _two.flag_setup, @function
_two.flag_setup:
_two.flag_setup.prolog:
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
        jmp _two.flag_setup.body
_two.flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, _two.flag(%rip)
        jmp _two.flag_setup.epilog
_two.flag_setup.epilog:
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
.size _two.flag_setup, . - _two.flag_setup

.text
.align 8
.type _two.get, @function
_two.get:
_two.get.prolog:
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
        jmp _two.get.body
_two.get.body:
        movq _two.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je _two.get.cached
        jmp _two.get.init
_two.get.cached:
        movq two(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _two.get.epilog
_two.get.init:
        callq _two.init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, two(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _two.flag(%rip)
        movq -72(%rbp), %rax
        jmp _two.get.epilog
_two.get.epilog:
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
.size _two.get, . - _two.get

.text
.align 8
.type _two.init_function, @function
_two.init_function:
_two.init_function.prolog:
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
        jmp _two.init_function.body
_two.init_function.body:
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
        callq _one.get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp _two.init_function.epilog
_two.init_function.epilog:
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
.size _two.init_function, . - _two.init_function

.bss
.align 8
three:
        .zero 8

.bss
.align 8
_three.flag:
        .zero 8

.text
.align 8
.type _three.flag_setup, @function
_three.flag_setup:
_three.flag_setup.prolog:
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
        jmp _three.flag_setup.body
_three.flag_setup.body:
        movq x_false(%rip), %rax
        movq %rax, -64(%rbp)
        movq -64(%rbp), %rax
        movq %rax, _three.flag(%rip)
        jmp _three.flag_setup.epilog
_three.flag_setup.epilog:
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
.size _three.flag_setup, . - _three.flag_setup

.text
.align 8
.type _three.get, @function
_three.get:
_three.get.prolog:
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
        jmp _three.get.body
_three.get.body:
        movq _three.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je _three.get.cached
        jmp _three.get.init
_three.get.cached:
        movq three(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _three.get.epilog
_three.get.init:
        callq _three.init_function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, three(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _three.flag(%rip)
        movq -72(%rbp), %rax
        jmp _three.get.epilog
_three.get.epilog:
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
.size _three.get, . - _three.get

.text
.align 8
.type _three.init_function, @function
_three.init_function:
_three.init_function.prolog:
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
        jmp _three.init_function.body
_three.init_function.body:
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
        callq _two.get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp _three.init_function.epilog
_three.init_function.epilog:
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
.size _three.init_function, . - _three.init_function

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
        movq $x_println_non_void, %rdi
        orq $3, %rdi
        movq $8, %rsi
        movq $0, %rdx
        callq x_make_curry
        movq %rax, -64(%rbp)
        callq _three.get
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
__main.constant:
        .zero 8

.text
.align 8
.type __main.setup, @function
__main.setup:
__main.setup.prolog:
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
        jmp __main.setup.body
__main.setup.body:
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
        movq %rax, __main.constant(%rip)
        jmp __main.setup.epilog
__main.setup.epilog:
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
.size __main.setup, . - __main.setup

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
        callq _one.flag_setup
        movq %rax, -64(%rbp)
        callq _two.flag_setup
        movq %rax, -64(%rbp)
        callq _three.flag_setup
        movq %rax, -64(%rbp)
        callq __main.setup
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
