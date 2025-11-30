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
        subq $160, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -64(%rbp)
        movq iadd©constant(%rip), %rax
        movq %rax, -72(%rbp)
        movq $336, -80(%rbp)
        movq -72(%rbp), %rdi
        movq -80(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq ineg©constant(%rip), %rax
        movq %rax, -96(%rbp)
        movq $80, -104(%rbp)
        movq -96(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq -88(%rbp), %rdi
        movq -112(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        movq iadd©constant(%rip), %rax
        movq %rax, -128(%rbp)
        movq -128(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq $80, -144(%rbp)
        movq -136(%rbp), %rdi
        movq -144(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        movq -64(%rbp), %rdi
        movq -152(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -160(%rbp)
        movq -160(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $160, %rsp
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
        .quad _main©metadata.name
        .quad 0
        .quad 0
        .quad _main©variable_info
.size _main©metadata, . - _main©metadata

.data
.align 8
.type _main©metadata.name, @object
_main©metadata.name:
        .string "_main"
.size _main©metadata.name, . - _main©metadata.name

.data
.align 8
.type _main©variable_info, @object
_main©variable_info:
        .quad 13
        .quad _main©variable_info.names
.size _main©variable_info, . - _main©variable_info

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
.type println_non_void©metadata, @object
println_non_void©metadata:
        .quad println_non_void©metadata.name
        .quad 1
        .quad 1
        .quad 0
.size println_non_void©metadata, . - println_non_void©metadata

.data
.align 8
.type println_non_void©metadata.name, @object
println_non_void©metadata.name:
        .string "println-non-void"
.size println_non_void©metadata.name, . - println_non_void©metadata.name

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
.type ineg©metadata, @object
ineg©metadata:
        .quad ineg©metadata.name
        .quad 1
        .quad 1
        .quad 0
.size ineg©metadata, . - ineg©metadata

.data
.align 8
.type ineg©metadata.name, @object
ineg©metadata.name:
        .string "ineg"
.size ineg©metadata.name, . - ineg©metadata.name

.bss
.align 8
ineg©constant:
        .zero 8

.text
.align 8
.type ineg©setup, @function
ineg©setup:
ineg©setup.prolog:
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
        jmp ineg©setup.body
ineg©setup.body:
        movq $x_ineg, -64(%rbp)
        orq $3, -64(%rbp)
        movq $8, -72(%rbp)
        movq $0, -80(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        movq -80(%rbp), %rdx
        callq x_make_curry
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        movq %rax, ineg©constant(%rip)
        jmp ineg©setup.epilog
ineg©setup.epilog:
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
.size ineg©setup, . - ineg©setup

.data
.align 8
.type iadd©metadata, @object
iadd©metadata:
        .quad iadd©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size iadd©metadata, . - iadd©metadata

.data
.align 8
.type iadd©metadata.name, @object
iadd©metadata.name:
        .string "iadd"
.size iadd©metadata.name, . - iadd©metadata.name

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
        .quad make_curry©metadata.name
        .quad 3
        .quad 1
        .quad 0
.size make_curry©metadata, . - make_curry©metadata

.data
.align 8
.type make_curry©metadata.name, @object
make_curry©metadata.name:
        .string "make-curry"
.size make_curry©metadata.name, . - make_curry©metadata.name

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
        callq println_non_void©setup
        movq %rax, -64(%rbp)
        callq ineg©setup
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

.data
.align 8
.type _main©variable_info.names, @object
_main©variable_info.names:
        .quad _main©variable_info.names.0
        .quad _main©variable_info.names.1
        .quad _main©variable_info.names.2
        .quad _main©variable_info.names.3
        .quad _main©variable_info.names.4
        .quad _main©variable_info.names.5
        .quad _main©variable_info.names.6
        .quad _main©variable_info.names.7
        .quad _main©variable_info.names.8
        .quad _main©variable_info.names.9
        .quad _main©variable_info.names.10
        .quad _main©variable_info.names.11
        .quad _main©variable_info.names.12
.size _main©variable_info.names, . - _main©variable_info.names

.data
.align 8
.type _main©variable_info.names.0, @object
_main©variable_info.names.0:
        .string "_₁"
.size _main©variable_info.names.0, . - _main©variable_info.names.0

.data
.align 8
.type _main©variable_info.names.1, @object
_main©variable_info.names.1:
        .string "_₂"
.size _main©variable_info.names.1, . - _main©variable_info.names.1

.data
.align 8
.type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "_₃"
.size _main©variable_info.names.2, . - _main©variable_info.names.2

.data
.align 8
.type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_₄"
.size _main©variable_info.names.3, . - _main©variable_info.names.3

.data
.align 8
.type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "_₅"
.size _main©variable_info.names.4, . - _main©variable_info.names.4

.data
.align 8
.type _main©variable_info.names.5, @object
_main©variable_info.names.5:
        .string "_₆"
.size _main©variable_info.names.5, . - _main©variable_info.names.5

.data
.align 8
.type _main©variable_info.names.6, @object
_main©variable_info.names.6:
        .string "_₇"
.size _main©variable_info.names.6, . - _main©variable_info.names.6

.data
.align 8
.type _main©variable_info.names.7, @object
_main©variable_info.names.7:
        .string "x₁"
.size _main©variable_info.names.7, . - _main©variable_info.names.7

.data
.align 8
.type _main©variable_info.names.8, @object
_main©variable_info.names.8:
        .string "_₈"
.size _main©variable_info.names.8, . - _main©variable_info.names.8

.data
.align 8
.type _main©variable_info.names.9, @object
_main©variable_info.names.9:
        .string "_₉"
.size _main©variable_info.names.9, . - _main©variable_info.names.9

.data
.align 8
.type _main©variable_info.names.10, @object
_main©variable_info.names.10:
        .string "_₁₀"
.size _main©variable_info.names.10, . - _main©variable_info.names.10

.data
.align 8
.type _main©variable_info.names.11, @object
_main©variable_info.names.11:
        .string "_₁₁"
.size _main©variable_info.names.11, . - _main©variable_info.names.11

.data
.align 8
.type _main©variable_info.names.12, @object
_main©variable_info.names.12:
        .string "_↩"
.size _main©variable_info.names.12, . - _main©variable_info.names.12

.data
.align 8
.type _main©setup©variable_info, @object
_main©setup©variable_info:
        .quad 4
        .quad _main©setup©variable_info.names
.size _main©setup©variable_info, . - _main©setup©variable_info

.data
.align 8
.type _main©setup©variable_info.names, @object
_main©setup©variable_info.names:
        .quad _main©setup©variable_info.names.0
        .quad _main©setup©variable_info.names.1
        .quad _main©setup©variable_info.names.2
        .quad _main©setup©variable_info.names.3
.size _main©setup©variable_info.names, . - _main©setup©variable_info.names

.data
.align 8
.type _main©setup©variable_info.names.0, @object
_main©setup©variable_info.names.0:
        .string "address"
.size _main©setup©variable_info.names.0, . - _main©setup©variable_info.names.0

.data
.align 8
.type _main©setup©variable_info.names.1, @object
_main©setup©variable_info.names.1:
        .string "arity"
.size _main©setup©variable_info.names.1, . - _main©setup©variable_info.names.1

.data
.align 8
.type _main©setup©variable_info.names.2, @object
_main©setup©variable_info.names.2:
        .string "size"
.size _main©setup©variable_info.names.2, . - _main©setup©variable_info.names.2

.data
.align 8
.type _main©setup©variable_info.names.3, @object
_main©setup©variable_info.names.3:
        .string "curry"
.size _main©setup©variable_info.names.3, . - _main©setup©variable_info.names.3

.data
.align 8
.type println_non_void©setup©variable_info, @object
println_non_void©setup©variable_info:
        .quad 4
        .quad println_non_void©setup©variable_info.names
.size println_non_void©setup©variable_info, . - println_non_void©setup©variable_info

.data
.align 8
.type println_non_void©setup©variable_info.names, @object
println_non_void©setup©variable_info.names:
        .quad println_non_void©setup©variable_info.names.0
        .quad println_non_void©setup©variable_info.names.1
        .quad println_non_void©setup©variable_info.names.2
        .quad println_non_void©setup©variable_info.names.3
.size println_non_void©setup©variable_info.names, . - println_non_void©setup©variable_info.names

.data
.align 8
.type println_non_void©setup©variable_info.names.0, @object
println_non_void©setup©variable_info.names.0:
        .string "address"
.size println_non_void©setup©variable_info.names.0, . - println_non_void©setup©variable_info.names.0

.data
.align 8
.type println_non_void©setup©variable_info.names.1, @object
println_non_void©setup©variable_info.names.1:
        .string "arity"
.size println_non_void©setup©variable_info.names.1, . - println_non_void©setup©variable_info.names.1

.data
.align 8
.type println_non_void©setup©variable_info.names.2, @object
println_non_void©setup©variable_info.names.2:
        .string "size"
.size println_non_void©setup©variable_info.names.2, . - println_non_void©setup©variable_info.names.2

.data
.align 8
.type println_non_void©setup©variable_info.names.3, @object
println_non_void©setup©variable_info.names.3:
        .string "curry"
.size println_non_void©setup©variable_info.names.3, . - println_non_void©setup©variable_info.names.3

.data
.align 8
.type ineg©setup©variable_info, @object
ineg©setup©variable_info:
        .quad 4
        .quad ineg©setup©variable_info.names
.size ineg©setup©variable_info, . - ineg©setup©variable_info

.data
.align 8
.type ineg©setup©variable_info.names, @object
ineg©setup©variable_info.names:
        .quad ineg©setup©variable_info.names.0
        .quad ineg©setup©variable_info.names.1
        .quad ineg©setup©variable_info.names.2
        .quad ineg©setup©variable_info.names.3
.size ineg©setup©variable_info.names, . - ineg©setup©variable_info.names

.data
.align 8
.type ineg©setup©variable_info.names.0, @object
ineg©setup©variable_info.names.0:
        .string "address"
.size ineg©setup©variable_info.names.0, . - ineg©setup©variable_info.names.0

.data
.align 8
.type ineg©setup©variable_info.names.1, @object
ineg©setup©variable_info.names.1:
        .string "arity"
.size ineg©setup©variable_info.names.1, . - ineg©setup©variable_info.names.1

.data
.align 8
.type ineg©setup©variable_info.names.2, @object
ineg©setup©variable_info.names.2:
        .string "size"
.size ineg©setup©variable_info.names.2, . - ineg©setup©variable_info.names.2

.data
.align 8
.type ineg©setup©variable_info.names.3, @object
ineg©setup©variable_info.names.3:
        .string "curry"
.size ineg©setup©variable_info.names.3, . - ineg©setup©variable_info.names.3

.data
.align 8
.type iadd©setup©variable_info, @object
iadd©setup©variable_info:
        .quad 4
        .quad iadd©setup©variable_info.names
.size iadd©setup©variable_info, . - iadd©setup©variable_info

.data
.align 8
.type iadd©setup©variable_info.names, @object
iadd©setup©variable_info.names:
        .quad iadd©setup©variable_info.names.0
        .quad iadd©setup©variable_info.names.1
        .quad iadd©setup©variable_info.names.2
        .quad iadd©setup©variable_info.names.3
.size iadd©setup©variable_info.names, . - iadd©setup©variable_info.names

.data
.align 8
.type iadd©setup©variable_info.names.0, @object
iadd©setup©variable_info.names.0:
        .string "address"
.size iadd©setup©variable_info.names.0, . - iadd©setup©variable_info.names.0

.data
.align 8
.type iadd©setup©variable_info.names.1, @object
iadd©setup©variable_info.names.1:
        .string "arity"
.size iadd©setup©variable_info.names.1, . - iadd©setup©variable_info.names.1

.data
.align 8
.type iadd©setup©variable_info.names.2, @object
iadd©setup©variable_info.names.2:
        .string "size"
.size iadd©setup©variable_info.names.2, . - iadd©setup©variable_info.names.2

.data
.align 8
.type iadd©setup©variable_info.names.3, @object
iadd©setup©variable_info.names.3:
        .string "curry"
.size iadd©setup©variable_info.names.3, . - iadd©setup©variable_info.names.3

.data
.align 8
.type make_curry©setup©variable_info, @object
make_curry©setup©variable_info:
        .quad 4
        .quad make_curry©setup©variable_info.names
.size make_curry©setup©variable_info, . - make_curry©setup©variable_info

.data
.align 8
.type make_curry©setup©variable_info.names, @object
make_curry©setup©variable_info.names:
        .quad make_curry©setup©variable_info.names.0
        .quad make_curry©setup©variable_info.names.1
        .quad make_curry©setup©variable_info.names.2
        .quad make_curry©setup©variable_info.names.3
.size make_curry©setup©variable_info.names, . - make_curry©setup©variable_info.names

.data
.align 8
.type make_curry©setup©variable_info.names.0, @object
make_curry©setup©variable_info.names.0:
        .string "address"
.size make_curry©setup©variable_info.names.0, . - make_curry©setup©variable_info.names.0

.data
.align 8
.type make_curry©setup©variable_info.names.1, @object
make_curry©setup©variable_info.names.1:
        .string "arity"
.size make_curry©setup©variable_info.names.1, . - make_curry©setup©variable_info.names.1

.data
.align 8
.type make_curry©setup©variable_info.names.2, @object
make_curry©setup©variable_info.names.2:
        .string "size"
.size make_curry©setup©variable_info.names.2, . - make_curry©setup©variable_info.names.2

.data
.align 8
.type make_curry©setup©variable_info.names.3, @object
make_curry©setup©variable_info.names.3:
        .string "curry"
.size make_curry©setup©variable_info.names.3, . - make_curry©setup©variable_info.names.3

.data
.align 8
.type _setup©variable_info, @object
_setup©variable_info:
        .quad 1
        .quad _setup©variable_info.names
.size _setup©variable_info, . - _setup©variable_info

.data
.align 8
.type _setup©variable_info.names, @object
_setup©variable_info.names:
        .quad _setup©variable_info.names.0
.size _setup©variable_info.names, . - _setup©variable_info.names

.data
.align 8
.type _setup©variable_info.names.0, @object
_setup©variable_info.names.0:
        .string "_"
.size _setup©variable_info.names.0, . - _setup©variable_info.names.0
