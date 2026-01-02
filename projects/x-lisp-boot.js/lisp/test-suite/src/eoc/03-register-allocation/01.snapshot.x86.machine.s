        .global _setup
        .global _main

        .section .text
        .align 8
        .type _main, @function
_main:
_main.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $144, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -8(%rbp)
        movq $8, -16(%rbp)
        movq $336, -24(%rbp)
        movq iadd©constant(%rip), %rax
        movq %rax, -32(%rbp)
        movq -32(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -40(%rbp)
        movq $56, -48(%rbp)
        movq -40(%rbp), %rdi
        movq -48(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -56(%rbp)
        movq -56(%rbp), %rax
        movq %rax, -64(%rbp)
        movq iadd©constant(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rdi
        movq -56(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rdi
        movq -24(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq iadd©constant(%rip), %rax
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -104(%rbp)
        movq ineg©constant(%rip), %rax
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rdi
        movq -64(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -120(%rbp)
        movq -104(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -128(%rbp)
        movq -8(%rbp), %rdi
        movq -128(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -136(%rbp)
        movq -136(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $144, %rsp
        popq %rbp
        retq 
_main.end:
        .size _main, . - _main

        .section .data
        .align 8
        .type _main©metadata, @object
_main©metadata:
        .quad _main©metadata.name
        .quad 0
        .quad 0
        .quad _main©variable_info
        .quad _main
        .quad _main.end
        .size _main©metadata, . - _main©metadata

        .section .data
        .align 8
        .type _main©metadata.name, @object
_main©metadata.name:
        .string "_main"
        .size _main©metadata.name, . - _main©metadata.name

        .section .bss
        .align 8
_main©constant:
        .zero 8

        .section .text
        .align 8
        .type _main©setup, @function
_main©setup:
_main©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
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
        addq $32, %rsp
        popq %rbp
        retq 
_main©setup.end:
        .size _main©setup, . - _main©setup

        .section .data
        .align 8
        .type println_non_void©metadata, @object
println_non_void©metadata:
        .quad println_non_void©metadata.name
        .quad 1
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size println_non_void©metadata, . - println_non_void©metadata

        .section .data
        .align 8
        .type println_non_void©metadata.name, @object
println_non_void©metadata.name:
        .string "println-non-void"
        .size println_non_void©metadata.name, . - println_non_void©metadata.name

        .section .bss
        .align 8
println_non_void©constant:
        .zero 8

        .section .text
        .align 8
        .type println_non_void©setup, @function
println_non_void©setup:
println_non_void©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
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
        addq $32, %rsp
        popq %rbp
        retq 
println_non_void©setup.end:
        .size println_non_void©setup, . - println_non_void©setup

        .section .data
        .align 8
        .type ineg©metadata, @object
ineg©metadata:
        .quad ineg©metadata.name
        .quad 1
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size ineg©metadata, . - ineg©metadata

        .section .data
        .align 8
        .type ineg©metadata.name, @object
ineg©metadata.name:
        .string "ineg"
        .size ineg©metadata.name, . - ineg©metadata.name

        .section .bss
        .align 8
ineg©constant:
        .zero 8

        .section .text
        .align 8
        .type ineg©setup, @function
ineg©setup:
ineg©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
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
        addq $32, %rsp
        popq %rbp
        retq 
ineg©setup.end:
        .size ineg©setup, . - ineg©setup

        .section .data
        .align 8
        .type iadd©metadata, @object
iadd©metadata:
        .quad iadd©metadata.name
        .quad 2
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size iadd©metadata, . - iadd©metadata

        .section .data
        .align 8
        .type iadd©metadata.name, @object
iadd©metadata.name:
        .string "iadd"
        .size iadd©metadata.name, . - iadd©metadata.name

        .section .bss
        .align 8
iadd©constant:
        .zero 8

        .section .text
        .align 8
        .type iadd©setup, @function
iadd©setup:
iadd©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp iadd©setup.body
iadd©setup.body:
        movq $x_iadd, -8(%rbp)
        orq $3, -8(%rbp)
        movq $iadd©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, iadd©constant(%rip)
        jmp iadd©setup.epilog
iadd©setup.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
iadd©setup.end:
        .size iadd©setup, . - iadd©setup

        .section .data
        .align 8
        .type make_function©metadata, @object
make_function©metadata:
        .quad make_function©metadata.name
        .quad 2
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size make_function©metadata, . - make_function©metadata

        .section .data
        .align 8
        .type make_function©metadata.name, @object
make_function©metadata.name:
        .string "make-function"
        .size make_function©metadata.name, . - make_function©metadata.name

        .section .bss
        .align 8
make_function©constant:
        .zero 8

        .section .text
        .align 8
        .type make_function©setup, @function
make_function©setup:
make_function©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
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
        addq $32, %rsp
        popq %rbp
        retq 
make_function©setup.end:
        .size make_function©setup, . - make_function©setup

        .section .data
        .align 8
        .type _function_table, @object
_function_table:
        .quad 0
        .quad _function_table.entries
        .size _function_table, . - _function_table

        .section .data
        .align 8
        .type _function_table.entries, @object
_function_table.entries:

        .size _function_table.entries, . - _function_table.entries

        .section .text
        .align 8
        .type _setup, @function
_setup:
_setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $16, %rsp
        jmp _setup.body
_setup.body:
        callq _main©setup
        movq %rax, -8(%rbp)
        callq println_non_void©setup
        movq %rax, -8(%rbp)
        callq ineg©setup
        movq %rax, -8(%rbp)
        callq iadd©setup
        movq %rax, -8(%rbp)
        callq make_function©setup
        movq %rax, -8(%rbp)
_setup.epilog:
        addq $16, %rsp
        popq %rbp
        retq 
_setup.end:
        .size _setup, . - _setup

        .section .data
        .align 8
        .type _main©variable_info, @object
_main©variable_info:
        .quad 17
        .quad _main©variable_info.names
        .size _main©variable_info, . - _main©variable_info

        .section .data
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
        .quad _main©variable_info.names.13
        .quad _main©variable_info.names.14
        .quad _main©variable_info.names.15
        .quad _main©variable_info.names.16
        .size _main©variable_info.names, . - _main©variable_info.names

        .section .data
        .align 8
        .type _main©variable_info.names.0, @object
_main©variable_info.names.0:
        .string "_₁"
        .size _main©variable_info.names.0, . - _main©variable_info.names.0

        .section .data
        .align 8
        .type _main©variable_info.names.1, @object
_main©variable_info.names.1:
        .string "v₁"
        .size _main©variable_info.names.1, . - _main©variable_info.names.1

        .section .data
        .align 8
        .type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "w₁"
        .size _main©variable_info.names.2, . - _main©variable_info.names.2

        .section .data
        .align 8
        .type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_₂"
        .size _main©variable_info.names.3, . - _main©variable_info.names.3

        .section .data
        .align 8
        .type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "_₃"
        .size _main©variable_info.names.4, . - _main©variable_info.names.4

        .section .data
        .align 8
        .type _main©variable_info.names.5, @object
_main©variable_info.names.5:
        .string "_₄"
        .size _main©variable_info.names.5, . - _main©variable_info.names.5

        .section .data
        .align 8
        .type _main©variable_info.names.6, @object
_main©variable_info.names.6:
        .string "x₁"
        .size _main©variable_info.names.6, . - _main©variable_info.names.6

        .section .data
        .align 8
        .type _main©variable_info.names.7, @object
_main©variable_info.names.7:
        .string "y₁"
        .size _main©variable_info.names.7, . - _main©variable_info.names.7

        .section .data
        .align 8
        .type _main©variable_info.names.8, @object
_main©variable_info.names.8:
        .string "_₅"
        .size _main©variable_info.names.8, . - _main©variable_info.names.8

        .section .data
        .align 8
        .type _main©variable_info.names.9, @object
_main©variable_info.names.9:
        .string "_₆"
        .size _main©variable_info.names.9, . - _main©variable_info.names.9

        .section .data
        .align 8
        .type _main©variable_info.names.10, @object
_main©variable_info.names.10:
        .string "z₁"
        .size _main©variable_info.names.10, . - _main©variable_info.names.10

        .section .data
        .align 8
        .type _main©variable_info.names.11, @object
_main©variable_info.names.11:
        .string "_₇"
        .size _main©variable_info.names.11, . - _main©variable_info.names.11

        .section .data
        .align 8
        .type _main©variable_info.names.12, @object
_main©variable_info.names.12:
        .string "_₈"
        .size _main©variable_info.names.12, . - _main©variable_info.names.12

        .section .data
        .align 8
        .type _main©variable_info.names.13, @object
_main©variable_info.names.13:
        .string "_₉"
        .size _main©variable_info.names.13, . - _main©variable_info.names.13

        .section .data
        .align 8
        .type _main©variable_info.names.14, @object
_main©variable_info.names.14:
        .string "_₁₀"
        .size _main©variable_info.names.14, . - _main©variable_info.names.14

        .section .data
        .align 8
        .type _main©variable_info.names.15, @object
_main©variable_info.names.15:
        .string "_₁₁"
        .size _main©variable_info.names.15, . - _main©variable_info.names.15

        .section .data
        .align 8
        .type _main©variable_info.names.16, @object
_main©variable_info.names.16:
        .string "_↩"
        .size _main©variable_info.names.16, . - _main©variable_info.names.16

        .section .data
        .align 8
        .type _main©setup©variable_info, @object
_main©setup©variable_info:
        .quad 3
        .quad _main©setup©variable_info.names
        .size _main©setup©variable_info, . - _main©setup©variable_info

        .section .data
        .align 8
        .type _main©setup©variable_info.names, @object
_main©setup©variable_info.names:
        .quad _main©setup©variable_info.names.0
        .quad _main©setup©variable_info.names.1
        .quad _main©setup©variable_info.names.2
        .size _main©setup©variable_info.names, . - _main©setup©variable_info.names

        .section .data
        .align 8
        .type _main©setup©variable_info.names.0, @object
_main©setup©variable_info.names.0:
        .string "address"
        .size _main©setup©variable_info.names.0, . - _main©setup©variable_info.names.0

        .section .data
        .align 8
        .type _main©setup©variable_info.names.1, @object
_main©setup©variable_info.names.1:
        .string "metadata"
        .size _main©setup©variable_info.names.1, . - _main©setup©variable_info.names.1

        .section .data
        .align 8
        .type _main©setup©variable_info.names.2, @object
_main©setup©variable_info.names.2:
        .string "function"
        .size _main©setup©variable_info.names.2, . - _main©setup©variable_info.names.2

        .section .data
        .align 8
        .type println_non_void©setup©variable_info, @object
println_non_void©setup©variable_info:
        .quad 3
        .quad println_non_void©setup©variable_info.names
        .size println_non_void©setup©variable_info, . - println_non_void©setup©variable_info

        .section .data
        .align 8
        .type println_non_void©setup©variable_info.names, @object
println_non_void©setup©variable_info.names:
        .quad println_non_void©setup©variable_info.names.0
        .quad println_non_void©setup©variable_info.names.1
        .quad println_non_void©setup©variable_info.names.2
        .size println_non_void©setup©variable_info.names, . - println_non_void©setup©variable_info.names

        .section .data
        .align 8
        .type println_non_void©setup©variable_info.names.0, @object
println_non_void©setup©variable_info.names.0:
        .string "address"
        .size println_non_void©setup©variable_info.names.0, . - println_non_void©setup©variable_info.names.0

        .section .data
        .align 8
        .type println_non_void©setup©variable_info.names.1, @object
println_non_void©setup©variable_info.names.1:
        .string "metadata"
        .size println_non_void©setup©variable_info.names.1, . - println_non_void©setup©variable_info.names.1

        .section .data
        .align 8
        .type println_non_void©setup©variable_info.names.2, @object
println_non_void©setup©variable_info.names.2:
        .string "function"
        .size println_non_void©setup©variable_info.names.2, . - println_non_void©setup©variable_info.names.2

        .section .data
        .align 8
        .type ineg©setup©variable_info, @object
ineg©setup©variable_info:
        .quad 3
        .quad ineg©setup©variable_info.names
        .size ineg©setup©variable_info, . - ineg©setup©variable_info

        .section .data
        .align 8
        .type ineg©setup©variable_info.names, @object
ineg©setup©variable_info.names:
        .quad ineg©setup©variable_info.names.0
        .quad ineg©setup©variable_info.names.1
        .quad ineg©setup©variable_info.names.2
        .size ineg©setup©variable_info.names, . - ineg©setup©variable_info.names

        .section .data
        .align 8
        .type ineg©setup©variable_info.names.0, @object
ineg©setup©variable_info.names.0:
        .string "address"
        .size ineg©setup©variable_info.names.0, . - ineg©setup©variable_info.names.0

        .section .data
        .align 8
        .type ineg©setup©variable_info.names.1, @object
ineg©setup©variable_info.names.1:
        .string "metadata"
        .size ineg©setup©variable_info.names.1, . - ineg©setup©variable_info.names.1

        .section .data
        .align 8
        .type ineg©setup©variable_info.names.2, @object
ineg©setup©variable_info.names.2:
        .string "function"
        .size ineg©setup©variable_info.names.2, . - ineg©setup©variable_info.names.2

        .section .data
        .align 8
        .type iadd©setup©variable_info, @object
iadd©setup©variable_info:
        .quad 3
        .quad iadd©setup©variable_info.names
        .size iadd©setup©variable_info, . - iadd©setup©variable_info

        .section .data
        .align 8
        .type iadd©setup©variable_info.names, @object
iadd©setup©variable_info.names:
        .quad iadd©setup©variable_info.names.0
        .quad iadd©setup©variable_info.names.1
        .quad iadd©setup©variable_info.names.2
        .size iadd©setup©variable_info.names, . - iadd©setup©variable_info.names

        .section .data
        .align 8
        .type iadd©setup©variable_info.names.0, @object
iadd©setup©variable_info.names.0:
        .string "address"
        .size iadd©setup©variable_info.names.0, . - iadd©setup©variable_info.names.0

        .section .data
        .align 8
        .type iadd©setup©variable_info.names.1, @object
iadd©setup©variable_info.names.1:
        .string "metadata"
        .size iadd©setup©variable_info.names.1, . - iadd©setup©variable_info.names.1

        .section .data
        .align 8
        .type iadd©setup©variable_info.names.2, @object
iadd©setup©variable_info.names.2:
        .string "function"
        .size iadd©setup©variable_info.names.2, . - iadd©setup©variable_info.names.2

        .section .data
        .align 8
        .type make_function©setup©variable_info, @object
make_function©setup©variable_info:
        .quad 3
        .quad make_function©setup©variable_info.names
        .size make_function©setup©variable_info, . - make_function©setup©variable_info

        .section .data
        .align 8
        .type make_function©setup©variable_info.names, @object
make_function©setup©variable_info.names:
        .quad make_function©setup©variable_info.names.0
        .quad make_function©setup©variable_info.names.1
        .quad make_function©setup©variable_info.names.2
        .size make_function©setup©variable_info.names, . - make_function©setup©variable_info.names

        .section .data
        .align 8
        .type make_function©setup©variable_info.names.0, @object
make_function©setup©variable_info.names.0:
        .string "address"
        .size make_function©setup©variable_info.names.0, . - make_function©setup©variable_info.names.0

        .section .data
        .align 8
        .type make_function©setup©variable_info.names.1, @object
make_function©setup©variable_info.names.1:
        .string "metadata"
        .size make_function©setup©variable_info.names.1, . - make_function©setup©variable_info.names.1

        .section .data
        .align 8
        .type make_function©setup©variable_info.names.2, @object
make_function©setup©variable_info.names.2:
        .string "function"
        .size make_function©setup©variable_info.names.2, . - make_function©setup©variable_info.names.2

        .section .data
        .align 8
        .type _setup©variable_info, @object
_setup©variable_info:
        .quad 1
        .quad _setup©variable_info.names
        .size _setup©variable_info, . - _setup©variable_info

        .section .data
        .align 8
        .type _setup©variable_info.names, @object
_setup©variable_info.names:
        .quad _setup©variable_info.names.0
        .size _setup©variable_info.names, . - _setup©variable_info.names

        .section .data
        .align 8
        .type _setup©variable_info.names.0, @object
_setup©variable_info.names.0:
        .string "_"
        .size _setup©variable_info.names.0, . - _setup©variable_info.names.0
