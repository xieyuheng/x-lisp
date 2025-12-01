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
        .quad 3
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
        subq $80, %rsp
        jmp _main©setup.body
_main©setup.body:
        movq $_main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $_main©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _main©constant(%rip)
        jmp _main©setup.epilog
_main©setup.epilog:
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
        subq $80, %rsp
        jmp println_non_void©setup.body
println_non_void©setup.body:
        movq $x_println_non_void, -64(%rbp)
        orq $3, -64(%rbp)
        movq $println_non_void©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, println_non_void©constant(%rip)
        jmp println_non_void©setup.epilog
println_non_void©setup.epilog:
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
.size println_non_void©setup, . - println_non_void©setup

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
        subq $80, %rsp
        jmp iadd©setup.body
iadd©setup.body:
        movq $x_iadd, -64(%rbp)
        orq $3, -64(%rbp)
        movq $iadd©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, iadd©constant(%rip)
        jmp iadd©setup.epilog
iadd©setup.epilog:
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
.size iadd©setup, . - iadd©setup

.data
.align 8
.type make_function©metadata, @object
make_function©metadata:
        .quad make_function©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size make_function©metadata, . - make_function©metadata

.data
.align 8
.type make_function©metadata.name, @object
make_function©metadata.name:
        .string "make-function"
.size make_function©metadata.name, . - make_function©metadata.name

.bss
.align 8
make_function©constant:
        .zero 8

.text
.align 8
.type make_function©setup, @function
make_function©setup:
make_function©setup.prolog:
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
        jmp make_function©setup.body
make_function©setup.body:
        movq $x_make_function, -64(%rbp)
        orq $3, -64(%rbp)
        movq $make_function©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, make_function©constant(%rip)
        jmp make_function©setup.epilog
make_function©setup.epilog:
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
.size make_function©setup, . - make_function©setup

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
        callq make_function©setup
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
.type one©flag_setup©variable_info, @object
one©flag_setup©variable_info:
        .quad 1
        .quad one©flag_setup©variable_info.names
.size one©flag_setup©variable_info, . - one©flag_setup©variable_info

.data
.align 8
.type one©flag_setup©variable_info.names, @object
one©flag_setup©variable_info.names:
        .quad one©flag_setup©variable_info.names.0
.size one©flag_setup©variable_info.names, . - one©flag_setup©variable_info.names

.data
.align 8
.type one©flag_setup©variable_info.names.0, @object
one©flag_setup©variable_info.names.0:
        .string "false"
.size one©flag_setup©variable_info.names.0, . - one©flag_setup©variable_info.names.0

.data
.align 8
.type one©get©variable_info, @object
one©get©variable_info:
        .quad 3
        .quad one©get©variable_info.names
.size one©get©variable_info, . - one©get©variable_info

.data
.align 8
.type one©get©variable_info.names, @object
one©get©variable_info.names:
        .quad one©get©variable_info.names.0
        .quad one©get©variable_info.names.1
        .quad one©get©variable_info.names.2
.size one©get©variable_info.names, . - one©get©variable_info.names

.data
.align 8
.type one©get©variable_info.names.0, @object
one©get©variable_info.names.0:
        .string "flag"
.size one©get©variable_info.names.0, . - one©get©variable_info.names.0

.data
.align 8
.type one©get©variable_info.names.1, @object
one©get©variable_info.names.1:
        .string "result"
.size one©get©variable_info.names.1, . - one©get©variable_info.names.1

.data
.align 8
.type one©get©variable_info.names.2, @object
one©get©variable_info.names.2:
        .string "true"
.size one©get©variable_info.names.2, . - one©get©variable_info.names.2

.data
.align 8
.type one©init_function©variable_info, @object
one©init_function©variable_info:
        .quad 1
        .quad one©init_function©variable_info.names
.size one©init_function©variable_info, . - one©init_function©variable_info

.data
.align 8
.type one©init_function©variable_info.names, @object
one©init_function©variable_info.names:
        .quad one©init_function©variable_info.names.0
.size one©init_function©variable_info.names, . - one©init_function©variable_info.names

.data
.align 8
.type one©init_function©variable_info.names.0, @object
one©init_function©variable_info.names.0:
        .string "_↩"
.size one©init_function©variable_info.names.0, . - one©init_function©variable_info.names.0

.data
.align 8
.type two©flag_setup©variable_info, @object
two©flag_setup©variable_info:
        .quad 1
        .quad two©flag_setup©variable_info.names
.size two©flag_setup©variable_info, . - two©flag_setup©variable_info

.data
.align 8
.type two©flag_setup©variable_info.names, @object
two©flag_setup©variable_info.names:
        .quad two©flag_setup©variable_info.names.0
.size two©flag_setup©variable_info.names, . - two©flag_setup©variable_info.names

.data
.align 8
.type two©flag_setup©variable_info.names.0, @object
two©flag_setup©variable_info.names.0:
        .string "false"
.size two©flag_setup©variable_info.names.0, . - two©flag_setup©variable_info.names.0

.data
.align 8
.type two©get©variable_info, @object
two©get©variable_info:
        .quad 3
        .quad two©get©variable_info.names
.size two©get©variable_info, . - two©get©variable_info

.data
.align 8
.type two©get©variable_info.names, @object
two©get©variable_info.names:
        .quad two©get©variable_info.names.0
        .quad two©get©variable_info.names.1
        .quad two©get©variable_info.names.2
.size two©get©variable_info.names, . - two©get©variable_info.names

.data
.align 8
.type two©get©variable_info.names.0, @object
two©get©variable_info.names.0:
        .string "flag"
.size two©get©variable_info.names.0, . - two©get©variable_info.names.0

.data
.align 8
.type two©get©variable_info.names.1, @object
two©get©variable_info.names.1:
        .string "result"
.size two©get©variable_info.names.1, . - two©get©variable_info.names.1

.data
.align 8
.type two©get©variable_info.names.2, @object
two©get©variable_info.names.2:
        .string "true"
.size two©get©variable_info.names.2, . - two©get©variable_info.names.2

.data
.align 8
.type two©init_function©variable_info, @object
two©init_function©variable_info:
        .quad 5
        .quad two©init_function©variable_info.names
.size two©init_function©variable_info, . - two©init_function©variable_info

.data
.align 8
.type two©init_function©variable_info.names, @object
two©init_function©variable_info.names:
        .quad two©init_function©variable_info.names.0
        .quad two©init_function©variable_info.names.1
        .quad two©init_function©variable_info.names.2
        .quad two©init_function©variable_info.names.3
        .quad two©init_function©variable_info.names.4
.size two©init_function©variable_info.names, . - two©init_function©variable_info.names

.data
.align 8
.type two©init_function©variable_info.names.0, @object
two©init_function©variable_info.names.0:
        .string "_₁"
.size two©init_function©variable_info.names.0, . - two©init_function©variable_info.names.0

.data
.align 8
.type two©init_function©variable_info.names.1, @object
two©init_function©variable_info.names.1:
        .string "_₂"
.size two©init_function©variable_info.names.1, . - two©init_function©variable_info.names.1

.data
.align 8
.type two©init_function©variable_info.names.2, @object
two©init_function©variable_info.names.2:
        .string "_₃"
.size two©init_function©variable_info.names.2, . - two©init_function©variable_info.names.2

.data
.align 8
.type two©init_function©variable_info.names.3, @object
two©init_function©variable_info.names.3:
        .string "_₄"
.size two©init_function©variable_info.names.3, . - two©init_function©variable_info.names.3

.data
.align 8
.type two©init_function©variable_info.names.4, @object
two©init_function©variable_info.names.4:
        .string "_↩"
.size two©init_function©variable_info.names.4, . - two©init_function©variable_info.names.4

.data
.align 8
.type three©flag_setup©variable_info, @object
three©flag_setup©variable_info:
        .quad 1
        .quad three©flag_setup©variable_info.names
.size three©flag_setup©variable_info, . - three©flag_setup©variable_info

.data
.align 8
.type three©flag_setup©variable_info.names, @object
three©flag_setup©variable_info.names:
        .quad three©flag_setup©variable_info.names.0
.size three©flag_setup©variable_info.names, . - three©flag_setup©variable_info.names

.data
.align 8
.type three©flag_setup©variable_info.names.0, @object
three©flag_setup©variable_info.names.0:
        .string "false"
.size three©flag_setup©variable_info.names.0, . - three©flag_setup©variable_info.names.0

.data
.align 8
.type three©get©variable_info, @object
three©get©variable_info:
        .quad 3
        .quad three©get©variable_info.names
.size three©get©variable_info, . - three©get©variable_info

.data
.align 8
.type three©get©variable_info.names, @object
three©get©variable_info.names:
        .quad three©get©variable_info.names.0
        .quad three©get©variable_info.names.1
        .quad three©get©variable_info.names.2
.size three©get©variable_info.names, . - three©get©variable_info.names

.data
.align 8
.type three©get©variable_info.names.0, @object
three©get©variable_info.names.0:
        .string "flag"
.size three©get©variable_info.names.0, . - three©get©variable_info.names.0

.data
.align 8
.type three©get©variable_info.names.1, @object
three©get©variable_info.names.1:
        .string "result"
.size three©get©variable_info.names.1, . - three©get©variable_info.names.1

.data
.align 8
.type three©get©variable_info.names.2, @object
three©get©variable_info.names.2:
        .string "true"
.size three©get©variable_info.names.2, . - three©get©variable_info.names.2

.data
.align 8
.type three©init_function©variable_info, @object
three©init_function©variable_info:
        .quad 5
        .quad three©init_function©variable_info.names
.size three©init_function©variable_info, . - three©init_function©variable_info

.data
.align 8
.type three©init_function©variable_info.names, @object
three©init_function©variable_info.names:
        .quad three©init_function©variable_info.names.0
        .quad three©init_function©variable_info.names.1
        .quad three©init_function©variable_info.names.2
        .quad three©init_function©variable_info.names.3
        .quad three©init_function©variable_info.names.4
.size three©init_function©variable_info.names, . - three©init_function©variable_info.names

.data
.align 8
.type three©init_function©variable_info.names.0, @object
three©init_function©variable_info.names.0:
        .string "_₁"
.size three©init_function©variable_info.names.0, . - three©init_function©variable_info.names.0

.data
.align 8
.type three©init_function©variable_info.names.1, @object
three©init_function©variable_info.names.1:
        .string "_₂"
.size three©init_function©variable_info.names.1, . - three©init_function©variable_info.names.1

.data
.align 8
.type three©init_function©variable_info.names.2, @object
three©init_function©variable_info.names.2:
        .string "_₃"
.size three©init_function©variable_info.names.2, . - three©init_function©variable_info.names.2

.data
.align 8
.type three©init_function©variable_info.names.3, @object
three©init_function©variable_info.names.3:
        .string "_₄"
.size three©init_function©variable_info.names.3, . - three©init_function©variable_info.names.3

.data
.align 8
.type three©init_function©variable_info.names.4, @object
three©init_function©variable_info.names.4:
        .string "_↩"
.size three©init_function©variable_info.names.4, . - three©init_function©variable_info.names.4

.data
.align 8
.type _main©variable_info.names, @object
_main©variable_info.names:
        .quad _main©variable_info.names.0
        .quad _main©variable_info.names.1
        .quad _main©variable_info.names.2
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
        .string "_↩"
.size _main©variable_info.names.2, . - _main©variable_info.names.2

.data
.align 8
.type _main©setup©variable_info, @object
_main©setup©variable_info:
        .quad 3
        .quad _main©setup©variable_info.names
.size _main©setup©variable_info, . - _main©setup©variable_info

.data
.align 8
.type _main©setup©variable_info.names, @object
_main©setup©variable_info.names:
        .quad _main©setup©variable_info.names.0
        .quad _main©setup©variable_info.names.1
        .quad _main©setup©variable_info.names.2
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
        .string "metadata"
.size _main©setup©variable_info.names.1, . - _main©setup©variable_info.names.1

.data
.align 8
.type _main©setup©variable_info.names.2, @object
_main©setup©variable_info.names.2:
        .string "function"
.size _main©setup©variable_info.names.2, . - _main©setup©variable_info.names.2

.data
.align 8
.type println_non_void©setup©variable_info, @object
println_non_void©setup©variable_info:
        .quad 3
        .quad println_non_void©setup©variable_info.names
.size println_non_void©setup©variable_info, . - println_non_void©setup©variable_info

.data
.align 8
.type println_non_void©setup©variable_info.names, @object
println_non_void©setup©variable_info.names:
        .quad println_non_void©setup©variable_info.names.0
        .quad println_non_void©setup©variable_info.names.1
        .quad println_non_void©setup©variable_info.names.2
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
        .string "metadata"
.size println_non_void©setup©variable_info.names.1, . - println_non_void©setup©variable_info.names.1

.data
.align 8
.type println_non_void©setup©variable_info.names.2, @object
println_non_void©setup©variable_info.names.2:
        .string "function"
.size println_non_void©setup©variable_info.names.2, . - println_non_void©setup©variable_info.names.2

.data
.align 8
.type iadd©setup©variable_info, @object
iadd©setup©variable_info:
        .quad 3
        .quad iadd©setup©variable_info.names
.size iadd©setup©variable_info, . - iadd©setup©variable_info

.data
.align 8
.type iadd©setup©variable_info.names, @object
iadd©setup©variable_info.names:
        .quad iadd©setup©variable_info.names.0
        .quad iadd©setup©variable_info.names.1
        .quad iadd©setup©variable_info.names.2
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
        .string "metadata"
.size iadd©setup©variable_info.names.1, . - iadd©setup©variable_info.names.1

.data
.align 8
.type iadd©setup©variable_info.names.2, @object
iadd©setup©variable_info.names.2:
        .string "function"
.size iadd©setup©variable_info.names.2, . - iadd©setup©variable_info.names.2

.data
.align 8
.type make_function©setup©variable_info, @object
make_function©setup©variable_info:
        .quad 3
        .quad make_function©setup©variable_info.names
.size make_function©setup©variable_info, . - make_function©setup©variable_info

.data
.align 8
.type make_function©setup©variable_info.names, @object
make_function©setup©variable_info.names:
        .quad make_function©setup©variable_info.names.0
        .quad make_function©setup©variable_info.names.1
        .quad make_function©setup©variable_info.names.2
.size make_function©setup©variable_info.names, . - make_function©setup©variable_info.names

.data
.align 8
.type make_function©setup©variable_info.names.0, @object
make_function©setup©variable_info.names.0:
        .string "address"
.size make_function©setup©variable_info.names.0, . - make_function©setup©variable_info.names.0

.data
.align 8
.type make_function©setup©variable_info.names.1, @object
make_function©setup©variable_info.names.1:
        .string "metadata"
.size make_function©setup©variable_info.names.1, . - make_function©setup©variable_info.names.1

.data
.align 8
.type make_function©setup©variable_info.names.2, @object
make_function©setup©variable_info.names.2:
        .string "function"
.size make_function©setup©variable_info.names.2, . - make_function©setup©variable_info.names.2

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
