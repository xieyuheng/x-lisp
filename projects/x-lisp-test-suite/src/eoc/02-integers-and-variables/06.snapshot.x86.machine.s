.global _setup
.global _main

.text
.align 8
.type _main, @function
_main:
_main.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $48, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -8(%rbp)
        movq ineg©constant(%rip), %rax
        movq %rax, -16(%rbp)
        movq random_dice©constant(%rip), %rax
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -32(%rbp)
        movq -16(%rbp), %rdi
        movq -32(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -40(%rbp)
        movq -8(%rbp), %rdi
        movq -40(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -48(%rbp)
        movq -48(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $48, %rsp
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
        .quad 6
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
        subq $24, %rsp
        jmp _main©setup.body
_main©setup.body:
        movq $_main, -8(%rbp)
        orq $3, -8(%rbp)
        movq $_main©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, _main©constant(%rip)
        jmp _main©setup.epilog
_main©setup.epilog:
        addq $24, %rsp
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
        subq $24, %rsp
        jmp println_non_void©setup.body
println_non_void©setup.body:
        movq $x_println_non_void, -8(%rbp)
        orq $3, -8(%rbp)
        movq $println_non_void©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, println_non_void©constant(%rip)
        jmp println_non_void©setup.epilog
println_non_void©setup.epilog:
        addq $24, %rsp
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
        subq $24, %rsp
        jmp ineg©setup.body
ineg©setup.body:
        movq $x_ineg, -8(%rbp)
        orq $3, -8(%rbp)
        movq $ineg©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, ineg©constant(%rip)
        jmp ineg©setup.epilog
ineg©setup.epilog:
        addq $24, %rsp
        popq %rbp
        retq 
.size ineg©setup, . - ineg©setup

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
        subq $24, %rsp
        jmp make_function©setup.body
make_function©setup.body:
        movq $x_make_function, -8(%rbp)
        orq $3, -8(%rbp)
        movq $make_function©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, make_function©constant(%rip)
        jmp make_function©setup.epilog
make_function©setup.epilog:
        addq $24, %rsp
        popq %rbp
        retq 
.size make_function©setup, . - make_function©setup

.data
.align 8
.type random_dice©metadata, @object
random_dice©metadata:
        .quad random_dice©metadata.name
        .quad 0
        .quad 1
        .quad 0
.size random_dice©metadata, . - random_dice©metadata

.data
.align 8
.type random_dice©metadata.name, @object
random_dice©metadata.name:
        .string "random-dice"
.size random_dice©metadata.name, . - random_dice©metadata.name

.bss
.align 8
random_dice©constant:
        .zero 8

.text
.align 8
.type random_dice©setup, @function
random_dice©setup:
random_dice©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $24, %rsp
        jmp random_dice©setup.body
random_dice©setup.body:
        movq $x_random_dice, -8(%rbp)
        orq $3, -8(%rbp)
        movq $random_dice©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, random_dice©constant(%rip)
        jmp random_dice©setup.epilog
random_dice©setup.epilog:
        addq $24, %rsp
        popq %rbp
        retq 
.size random_dice©setup, . - random_dice©setup

.text
.align 8
.type _setup, @function
_setup:
_setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $8, %rsp
        jmp _setup.body
_setup.body:
        callq _main©setup
        movq %rax, -8(%rbp)
        callq println_non_void©setup
        movq %rax, -8(%rbp)
        callq ineg©setup
        movq %rax, -8(%rbp)
        callq make_function©setup
        movq %rax, -8(%rbp)
        callq random_dice©setup
        movq %rax, -8(%rbp)
_setup.epilog:
        addq $8, %rsp
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
        .string "_↩"
.size _main©variable_info.names.5, . - _main©variable_info.names.5

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
.type ineg©setup©variable_info, @object
ineg©setup©variable_info:
        .quad 3
        .quad ineg©setup©variable_info.names
.size ineg©setup©variable_info, . - ineg©setup©variable_info

.data
.align 8
.type ineg©setup©variable_info.names, @object
ineg©setup©variable_info.names:
        .quad ineg©setup©variable_info.names.0
        .quad ineg©setup©variable_info.names.1
        .quad ineg©setup©variable_info.names.2
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
        .string "metadata"
.size ineg©setup©variable_info.names.1, . - ineg©setup©variable_info.names.1

.data
.align 8
.type ineg©setup©variable_info.names.2, @object
ineg©setup©variable_info.names.2:
        .string "function"
.size ineg©setup©variable_info.names.2, . - ineg©setup©variable_info.names.2

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
.type random_dice©setup©variable_info, @object
random_dice©setup©variable_info:
        .quad 3
        .quad random_dice©setup©variable_info.names
.size random_dice©setup©variable_info, . - random_dice©setup©variable_info

.data
.align 8
.type random_dice©setup©variable_info.names, @object
random_dice©setup©variable_info.names:
        .quad random_dice©setup©variable_info.names.0
        .quad random_dice©setup©variable_info.names.1
        .quad random_dice©setup©variable_info.names.2
.size random_dice©setup©variable_info.names, . - random_dice©setup©variable_info.names

.data
.align 8
.type random_dice©setup©variable_info.names.0, @object
random_dice©setup©variable_info.names.0:
        .string "address"
.size random_dice©setup©variable_info.names.0, . - random_dice©setup©variable_info.names.0

.data
.align 8
.type random_dice©setup©variable_info.names.1, @object
random_dice©setup©variable_info.names.1:
        .string "metadata"
.size random_dice©setup©variable_info.names.1, . - random_dice©setup©variable_info.names.1

.data
.align 8
.type random_dice©setup©variable_info.names.2, @object
random_dice©setup©variable_info.names.2:
        .string "function"
.size random_dice©setup©variable_info.names.2, . - random_dice©setup©variable_info.names.2

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
