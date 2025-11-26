.global _main

.bss
.align 8
_one:
        .zero 8

.data
.align 8
.type _©one.flag, @object
_©one.flag:
_©one.flag.entry:
        .quad 2550726238951964672
.size _©one.flag, . - _©one.flag

.text
.align 8
.type _©one.get, @function
_©one.get:
_©one.get.prolog:
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
        jmp _©one.get.body
_©one.get.body:
        movq _©one.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je _©one.get.cached
        jmp _©one.get.init
_©one.get.cached:
        movq _one(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _©one.get.epilog
_©one.get.init:
        callq _©one.function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, _one(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _©one.flag(%rip)
        movq -72(%rbp), %rax
        jmp _©one.get.epilog
_©one.get.epilog:
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
.size _©one.get, . - _©one.get

.text
.align 8
.type _©one.function, @function
_©one.function:
_©one.function.prolog:
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
        jmp _©one.function.body
_©one.function.body:
        movq $8, -64(%rbp)
        movq -64(%rbp), %rax
        jmp _©one.function.epilog
_©one.function.epilog:
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
.size _©one.function, . - _©one.function

.bss
.align 8
_two:
        .zero 8

.data
.align 8
.type _©two.flag, @object
_©two.flag:
_©two.flag.entry:
        .quad 2550726238951964672
.size _©two.flag, . - _©two.flag

.text
.align 8
.type _©two.get, @function
_©two.get:
_©two.get.prolog:
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
        jmp _©two.get.body
_©two.get.body:
        movq _©two.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je _©two.get.cached
        jmp _©two.get.init
_©two.get.cached:
        movq _two(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _©two.get.epilog
_©two.get.init:
        callq _©two.function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, _two(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _©two.flag(%rip)
        movq -72(%rbp), %rax
        jmp _©two.get.epilog
_©two.get.epilog:
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
.size _©two.get, . - _©two.get

.text
.align 8
.type _©two.function, @function
_©two.function:
_©two.function.prolog:
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
        jmp _©two.function.body
_©two.function.body:
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
        callq _©one.get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp _©two.function.epilog
_©two.function.epilog:
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
.size _©two.function, . - _©two.function

.bss
.align 8
_three:
        .zero 8

.data
.align 8
.type _©three.flag, @object
_©three.flag:
_©three.flag.entry:
        .quad 2550726238951964672
.size _©three.flag, . - _©three.flag

.text
.align 8
.type _©three.get, @function
_©three.get:
_©three.get.prolog:
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
        jmp _©three.get.body
_©three.get.body:
        movq _©three.flag(%rip), %rax
        movq %rax, -64(%rbp)
        movq x_true(%rip), %rax
        cmpq -64(%rbp), %rax
        je _©three.get.cached
        jmp _©three.get.init
_©three.get.cached:
        movq _three(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _©three.get.epilog
_©three.get.init:
        callq _©three.function
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        movq %rax, _three(%rip)
        movq x_true(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _©three.flag(%rip)
        movq -72(%rbp), %rax
        jmp _©three.get.epilog
_©three.get.epilog:
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
.size _©three.get, . - _©three.get

.text
.align 8
.type _©three.function, @function
_©three.function:
_©three.function.prolog:
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
        jmp _©three.function.body
_©three.function.body:
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
        callq _©two.get
        movq %rax, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rax
        jmp _©three.function.epilog
_©three.function.epilog:
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
.size _©three.function, . - _©three.function

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
        callq _©three.get
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
