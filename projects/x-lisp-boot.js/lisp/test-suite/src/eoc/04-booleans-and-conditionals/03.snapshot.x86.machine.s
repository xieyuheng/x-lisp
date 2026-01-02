        .global _setup
        .global _main

        .section .text
        .align 8
        .type _main, @function
_main:
_main.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $128, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -8(%rbp)
        movq equal_p©constant(%rip), %rax
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
        movq $8, -48(%rbp)
        movq -40(%rbp), %rdi
        movq -48(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -56(%rbp)
        movq x_true(%rip), %rax
        cmpq -56(%rbp), %rax
        je _main.then₅
        jmp _main.else₆
_main.let_body₁:
        movq -8(%rbp), %rdi
        movq -64(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rax
        jmp _main.epilog
_main.then₂:
        movq $0, -64(%rbp)
        jmp _main.let_body₁
_main.else₃:
        movq $336, -64(%rbp)
        jmp _main.let_body₁
_main.let_body₄:
        movq x_true(%rip), %rax
        cmpq -80(%rbp), %rax
        je _main.then₂
        jmp _main.else₃
_main.then₅:
        movq equal_p©constant(%rip), %rax
        movq %rax, -88(%rbp)
        movq random_dice©constant(%rip), %rax
        movq %rax, -96(%rbp)
        movq -96(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -104(%rbp)
        movq -88(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq $16, -120(%rbp)
        movq -112(%rbp), %rdi
        movq -120(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        jmp _main.let_body₄
_main.else₆:
        movq x_false(%rip), %rax
        movq %rax, -80(%rbp)
        jmp _main.let_body₄
_main.epilog:
        addq $128, %rsp
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
        .type equal_p©metadata, @object
equal_p©metadata:
        .quad equal_p©metadata.name
        .quad 2
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size equal_p©metadata, . - equal_p©metadata

        .section .data
        .align 8
        .type equal_p©metadata.name, @object
equal_p©metadata.name:
        .string "equal?"
        .size equal_p©metadata.name, . - equal_p©metadata.name

        .section .bss
        .align 8
equal_p©constant:
        .zero 8

        .section .text
        .align 8
        .type equal_p©setup, @function
equal_p©setup:
equal_p©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp equal_p©setup.body
equal_p©setup.body:
        movq $x_equal_p, -8(%rbp)
        orq $3, -8(%rbp)
        movq $equal_p©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, equal_p©constant(%rip)
        jmp equal_p©setup.epilog
equal_p©setup.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
equal_p©setup.end:
        .size equal_p©setup, . - equal_p©setup

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
        .type random_dice©metadata, @object
random_dice©metadata:
        .quad random_dice©metadata.name
        .quad 0
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size random_dice©metadata, . - random_dice©metadata

        .section .data
        .align 8
        .type random_dice©metadata.name, @object
random_dice©metadata.name:
        .string "random-dice"
        .size random_dice©metadata.name, . - random_dice©metadata.name

        .section .bss
        .align 8
random_dice©constant:
        .zero 8

        .section .text
        .align 8
        .type random_dice©setup, @function
random_dice©setup:
random_dice©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
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
        addq $32, %rsp
        popq %rbp
        retq 
random_dice©setup.end:
        .size random_dice©setup, . - random_dice©setup

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
        callq equal_p©setup
        movq %rax, -8(%rbp)
        callq println_non_void©setup
        movq %rax, -8(%rbp)
        callq make_function©setup
        movq %rax, -8(%rbp)
        callq random_dice©setup
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
        .quad 15
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
        .string "_₄"
        .size _main©variable_info.names.1, . - _main©variable_info.names.1

        .section .data
        .align 8
        .type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "_₅"
        .size _main©variable_info.names.2, . - _main©variable_info.names.2

        .section .data
        .align 8
        .type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_₆"
        .size _main©variable_info.names.3, . - _main©variable_info.names.3

        .section .data
        .align 8
        .type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "_₇"
        .size _main©variable_info.names.4, . - _main©variable_info.names.4

        .section .data
        .align 8
        .type _main©variable_info.names.5, @object
_main©variable_info.names.5:
        .string "_₈"
        .size _main©variable_info.names.5, . - _main©variable_info.names.5

        .section .data
        .align 8
        .type _main©variable_info.names.6, @object
_main©variable_info.names.6:
        .string "_₉"
        .size _main©variable_info.names.6, . - _main©variable_info.names.6

        .section .data
        .align 8
        .type _main©variable_info.names.7, @object
_main©variable_info.names.7:
        .string "_₂"
        .size _main©variable_info.names.7, . - _main©variable_info.names.7

        .section .data
        .align 8
        .type _main©variable_info.names.8, @object
_main©variable_info.names.8:
        .string "_↩"
        .size _main©variable_info.names.8, . - _main©variable_info.names.8

        .section .data
        .align 8
        .type _main©variable_info.names.9, @object
_main©variable_info.names.9:
        .string "_₃"
        .size _main©variable_info.names.9, . - _main©variable_info.names.9

        .section .data
        .align 8
        .type _main©variable_info.names.10, @object
_main©variable_info.names.10:
        .string "_₁₀"
        .size _main©variable_info.names.10, . - _main©variable_info.names.10

        .section .data
        .align 8
        .type _main©variable_info.names.11, @object
_main©variable_info.names.11:
        .string "_₁₁"
        .size _main©variable_info.names.11, . - _main©variable_info.names.11

        .section .data
        .align 8
        .type _main©variable_info.names.12, @object
_main©variable_info.names.12:
        .string "_₁₂"
        .size _main©variable_info.names.12, . - _main©variable_info.names.12

        .section .data
        .align 8
        .type _main©variable_info.names.13, @object
_main©variable_info.names.13:
        .string "_₁₃"
        .size _main©variable_info.names.13, . - _main©variable_info.names.13

        .section .data
        .align 8
        .type _main©variable_info.names.14, @object
_main©variable_info.names.14:
        .string "_₁₄"
        .size _main©variable_info.names.14, . - _main©variable_info.names.14

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
        .type equal_p©setup©variable_info, @object
equal_p©setup©variable_info:
        .quad 3
        .quad equal_p©setup©variable_info.names
        .size equal_p©setup©variable_info, . - equal_p©setup©variable_info

        .section .data
        .align 8
        .type equal_p©setup©variable_info.names, @object
equal_p©setup©variable_info.names:
        .quad equal_p©setup©variable_info.names.0
        .quad equal_p©setup©variable_info.names.1
        .quad equal_p©setup©variable_info.names.2
        .size equal_p©setup©variable_info.names, . - equal_p©setup©variable_info.names

        .section .data
        .align 8
        .type equal_p©setup©variable_info.names.0, @object
equal_p©setup©variable_info.names.0:
        .string "address"
        .size equal_p©setup©variable_info.names.0, . - equal_p©setup©variable_info.names.0

        .section .data
        .align 8
        .type equal_p©setup©variable_info.names.1, @object
equal_p©setup©variable_info.names.1:
        .string "metadata"
        .size equal_p©setup©variable_info.names.1, . - equal_p©setup©variable_info.names.1

        .section .data
        .align 8
        .type equal_p©setup©variable_info.names.2, @object
equal_p©setup©variable_info.names.2:
        .string "function"
        .size equal_p©setup©variable_info.names.2, . - equal_p©setup©variable_info.names.2

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
        .type random_dice©setup©variable_info, @object
random_dice©setup©variable_info:
        .quad 3
        .quad random_dice©setup©variable_info.names
        .size random_dice©setup©variable_info, . - random_dice©setup©variable_info

        .section .data
        .align 8
        .type random_dice©setup©variable_info.names, @object
random_dice©setup©variable_info.names:
        .quad random_dice©setup©variable_info.names.0
        .quad random_dice©setup©variable_info.names.1
        .quad random_dice©setup©variable_info.names.2
        .size random_dice©setup©variable_info.names, . - random_dice©setup©variable_info.names

        .section .data
        .align 8
        .type random_dice©setup©variable_info.names.0, @object
random_dice©setup©variable_info.names.0:
        .string "address"
        .size random_dice©setup©variable_info.names.0, . - random_dice©setup©variable_info.names.0

        .section .data
        .align 8
        .type random_dice©setup©variable_info.names.1, @object
random_dice©setup©variable_info.names.1:
        .string "metadata"
        .size random_dice©setup©variable_info.names.1, . - random_dice©setup©variable_info.names.1

        .section .data
        .align 8
        .type random_dice©setup©variable_info.names.2, @object
random_dice©setup©variable_info.names.2:
        .string "function"
        .size random_dice©setup©variable_info.names.2, . - random_dice©setup©variable_info.names.2

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
