.global _main

.bss
.align 8
_one:
        .zero 8

.data
.align 8
.type __one.flag, @object
__one.flag:
__one.flag.entry:
        .quad 2550726238951964672
.size __one.flag, . - __one.flag

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
        callq __one.function
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
.type __one.function, @function
__one.function:
__one.function.prolog:
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
        jmp __one.function.body
__one.function.body:
        movq $8, -64(%rbp)
        movq -64(%rbp), %rax
        jmp __one.function.epilog
__one.function.epilog:
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
.size __one.function, . - __one.function

.bss
.align 8
_two:
        .zero 8

.data
.align 8
.type __two.flag, @object
__two.flag:
__two.flag.entry:
        .quad 2550726238951964672
.size __two.flag, . - __two.flag

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
        callq __two.function
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
.type __two.function, @function
__two.function:
__two.function.prolog:
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
        jmp __two.function.body
__two.function.body:
        leaq x_iadd(%rip), %rdi
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
        jmp __two.function.epilog
__two.function.epilog:
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
.size __two.function, . - __two.function

.bss
.align 8
_three:
        .zero 8

.data
.align 8
.type __three.flag, @object
__three.flag:
__three.flag.entry:
        .quad 2550726238951964672
.size __three.flag, . - __three.flag

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
        callq __three.function
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
.type __three.function, @function
__three.function:
__three.function.prolog:
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
        jmp __three.function.body
__three.function.body:
        leaq x_iadd(%rip), %rdi
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
        jmp __three.function.epilog
__three.function.epilog:
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
.size __three.function, . - __three.function

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
        leaq x_println_non_void(%rip), %rdi
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
