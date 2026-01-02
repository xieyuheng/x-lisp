        .global _setup
        .global _main

        .section .text
        .align 8
        .type _main, @function
_main:
_main.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $304, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -8(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -16(%rbp)
        movq $8, -24(%rbp)
        movq -16(%rbp), %rdi
        movq -24(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -32(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -40(%rbp)
        movq -40(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -48(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -56(%rbp)
        movq $16, -64(%rbp)
        movq -56(%rbp), %rdi
        movq -64(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -72(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -88(%rbp)
        movq print©constant(%rip), %rax
        movq %rax, -96(%rbp)
        movq $24, -104(%rbp)
        movq -96(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -120(%rbp)
        movq -120(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -128(%rbp)
        movq equal_p©constant(%rip), %rax
        movq %rax, -136(%rbp)
        movq $8, -144(%rbp)
        movq -136(%rbp), %rdi
        movq -144(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -152(%rbp)
        movq $16, -160(%rbp)
        movq -152(%rbp), %rdi
        movq -160(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -168(%rbp)
        movq x_true(%rip), %rax
        cmpq -168(%rbp), %rax
        je _main.then₂
        jmp _main.else₃
_main.let_body₁:
        movq -8(%rbp), %rdi
        movq -176(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -184(%rbp)
        movq -184(%rbp), %rax
        jmp _main.epilog
_main.then₂:
        movq print©constant(%rip), %rax
        movq %rax, -192(%rbp)
        movq $888, -200(%rbp)
        movq -192(%rbp), %rdi
        movq -200(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -32(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -208(%rbp)
        movq -208(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -48(%rbp)
        movq equal_p©constant(%rip), %rax
        movq %rax, -216(%rbp)
        movq $8, -224(%rbp)
        movq -216(%rbp), %rdi
        movq -224(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -232(%rbp)
        movq $16, -240(%rbp)
        movq -232(%rbp), %rdi
        movq -240(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -176(%rbp)
        jmp _main.let_body₁
_main.else₃:
        movq print©constant(%rip), %rax
        movq %rax, -248(%rbp)
        movq $1776, -256(%rbp)
        movq -248(%rbp), %rdi
        movq -256(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -32(%rbp)
        movq newline©constant(%rip), %rax
        movq %rax, -264(%rbp)
        movq -264(%rbp), %rdi
        callq x_apply_nullary
        movq %rax, -48(%rbp)
        movq equal_p©constant(%rip), %rax
        movq %rax, -272(%rbp)
        movq $8, -280(%rbp)
        movq -272(%rbp), %rdi
        movq -280(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -288(%rbp)
        movq $16, -296(%rbp)
        movq -288(%rbp), %rdi
        movq -296(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -176(%rbp)
        jmp _main.let_body₁
_main.epilog:
        addq $304, %rsp
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
        .type print©metadata, @object
print©metadata:
        .quad print©metadata.name
        .quad 1
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size print©metadata, . - print©metadata

        .section .data
        .align 8
        .type print©metadata.name, @object
print©metadata.name:
        .string "print"
        .size print©metadata.name, . - print©metadata.name

        .section .bss
        .align 8
print©constant:
        .zero 8

        .section .text
        .align 8
        .type print©setup, @function
print©setup:
print©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp print©setup.body
print©setup.body:
        movq $x_print, -8(%rbp)
        orq $3, -8(%rbp)
        movq $print©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, print©constant(%rip)
        jmp print©setup.epilog
print©setup.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
print©setup.end:
        .size print©setup, . - print©setup

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
        .type newline©metadata, @object
newline©metadata:
        .quad newline©metadata.name
        .quad 0
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size newline©metadata, . - newline©metadata

        .section .data
        .align 8
        .type newline©metadata.name, @object
newline©metadata.name:
        .string "newline"
        .size newline©metadata.name, . - newline©metadata.name

        .section .bss
        .align 8
newline©constant:
        .zero 8

        .section .text
        .align 8
        .type newline©setup, @function
newline©setup:
newline©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp newline©setup.body
newline©setup.body:
        movq $x_newline, -8(%rbp)
        orq $3, -8(%rbp)
        movq $newline©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, newline©constant(%rip)
        jmp newline©setup.epilog
newline©setup.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
newline©setup.end:
        .size newline©setup, . - newline©setup

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
        callq equal_p©setup
        movq %rax, -8(%rbp)
        callq print©setup
        movq %rax, -8(%rbp)
        callq println_non_void©setup
        movq %rax, -8(%rbp)
        callq newline©setup
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
        .quad 37
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
        .quad _main©variable_info.names.17
        .quad _main©variable_info.names.18
        .quad _main©variable_info.names.19
        .quad _main©variable_info.names.20
        .quad _main©variable_info.names.21
        .quad _main©variable_info.names.22
        .quad _main©variable_info.names.23
        .quad _main©variable_info.names.24
        .quad _main©variable_info.names.25
        .quad _main©variable_info.names.26
        .quad _main©variable_info.names.27
        .quad _main©variable_info.names.28
        .quad _main©variable_info.names.29
        .quad _main©variable_info.names.30
        .quad _main©variable_info.names.31
        .quad _main©variable_info.names.32
        .quad _main©variable_info.names.33
        .quad _main©variable_info.names.34
        .quad _main©variable_info.names.35
        .quad _main©variable_info.names.36
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
        .string "_₃"
        .size _main©variable_info.names.1, . - _main©variable_info.names.1

        .section .data
        .align 8
        .type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "_₄"
        .size _main©variable_info.names.2, . - _main©variable_info.names.2

        .section .data
        .align 8
        .type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_∅₁"
        .size _main©variable_info.names.3, . - _main©variable_info.names.3

        .section .data
        .align 8
        .type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "_₅"
        .size _main©variable_info.names.4, . - _main©variable_info.names.4

        .section .data
        .align 8
        .type _main©variable_info.names.5, @object
_main©variable_info.names.5:
        .string "_∅₂"
        .size _main©variable_info.names.5, . - _main©variable_info.names.5

        .section .data
        .align 8
        .type _main©variable_info.names.6, @object
_main©variable_info.names.6:
        .string "_₆"
        .size _main©variable_info.names.6, . - _main©variable_info.names.6

        .section .data
        .align 8
        .type _main©variable_info.names.7, @object
_main©variable_info.names.7:
        .string "_₇"
        .size _main©variable_info.names.7, . - _main©variable_info.names.7

        .section .data
        .align 8
        .type _main©variable_info.names.8, @object
_main©variable_info.names.8:
        .string "_∅₃"
        .size _main©variable_info.names.8, . - _main©variable_info.names.8

        .section .data
        .align 8
        .type _main©variable_info.names.9, @object
_main©variable_info.names.9:
        .string "_₈"
        .size _main©variable_info.names.9, . - _main©variable_info.names.9

        .section .data
        .align 8
        .type _main©variable_info.names.10, @object
_main©variable_info.names.10:
        .string "_∅₄"
        .size _main©variable_info.names.10, . - _main©variable_info.names.10

        .section .data
        .align 8
        .type _main©variable_info.names.11, @object
_main©variable_info.names.11:
        .string "_₉"
        .size _main©variable_info.names.11, . - _main©variable_info.names.11

        .section .data
        .align 8
        .type _main©variable_info.names.12, @object
_main©variable_info.names.12:
        .string "_₁₀"
        .size _main©variable_info.names.12, . - _main©variable_info.names.12

        .section .data
        .align 8
        .type _main©variable_info.names.13, @object
_main©variable_info.names.13:
        .string "_∅₅"
        .size _main©variable_info.names.13, . - _main©variable_info.names.13

        .section .data
        .align 8
        .type _main©variable_info.names.14, @object
_main©variable_info.names.14:
        .string "_₁₁"
        .size _main©variable_info.names.14, . - _main©variable_info.names.14

        .section .data
        .align 8
        .type _main©variable_info.names.15, @object
_main©variable_info.names.15:
        .string "_∅₆"
        .size _main©variable_info.names.15, . - _main©variable_info.names.15

        .section .data
        .align 8
        .type _main©variable_info.names.16, @object
_main©variable_info.names.16:
        .string "_₁₂"
        .size _main©variable_info.names.16, . - _main©variable_info.names.16

        .section .data
        .align 8
        .type _main©variable_info.names.17, @object
_main©variable_info.names.17:
        .string "_₁₃"
        .size _main©variable_info.names.17, . - _main©variable_info.names.17

        .section .data
        .align 8
        .type _main©variable_info.names.18, @object
_main©variable_info.names.18:
        .string "_₁₄"
        .size _main©variable_info.names.18, . - _main©variable_info.names.18

        .section .data
        .align 8
        .type _main©variable_info.names.19, @object
_main©variable_info.names.19:
        .string "_₁₅"
        .size _main©variable_info.names.19, . - _main©variable_info.names.19

        .section .data
        .align 8
        .type _main©variable_info.names.20, @object
_main©variable_info.names.20:
        .string "_₁₆"
        .size _main©variable_info.names.20, . - _main©variable_info.names.20

        .section .data
        .align 8
        .type _main©variable_info.names.21, @object
_main©variable_info.names.21:
        .string "_₂"
        .size _main©variable_info.names.21, . - _main©variable_info.names.21

        .section .data
        .align 8
        .type _main©variable_info.names.22, @object
_main©variable_info.names.22:
        .string "_↩"
        .size _main©variable_info.names.22, . - _main©variable_info.names.22

        .section .data
        .align 8
        .type _main©variable_info.names.23, @object
_main©variable_info.names.23:
        .string "_₁₇"
        .size _main©variable_info.names.23, . - _main©variable_info.names.23

        .section .data
        .align 8
        .type _main©variable_info.names.24, @object
_main©variable_info.names.24:
        .string "_₁₈"
        .size _main©variable_info.names.24, . - _main©variable_info.names.24

        .section .data
        .align 8
        .type _main©variable_info.names.25, @object
_main©variable_info.names.25:
        .string "_₁₉"
        .size _main©variable_info.names.25, . - _main©variable_info.names.25

        .section .data
        .align 8
        .type _main©variable_info.names.26, @object
_main©variable_info.names.26:
        .string "_₂₀"
        .size _main©variable_info.names.26, . - _main©variable_info.names.26

        .section .data
        .align 8
        .type _main©variable_info.names.27, @object
_main©variable_info.names.27:
        .string "_₂₁"
        .size _main©variable_info.names.27, . - _main©variable_info.names.27

        .section .data
        .align 8
        .type _main©variable_info.names.28, @object
_main©variable_info.names.28:
        .string "_₂₂"
        .size _main©variable_info.names.28, . - _main©variable_info.names.28

        .section .data
        .align 8
        .type _main©variable_info.names.29, @object
_main©variable_info.names.29:
        .string "_₂₃"
        .size _main©variable_info.names.29, . - _main©variable_info.names.29

        .section .data
        .align 8
        .type _main©variable_info.names.30, @object
_main©variable_info.names.30:
        .string "_₂₄"
        .size _main©variable_info.names.30, . - _main©variable_info.names.30

        .section .data
        .align 8
        .type _main©variable_info.names.31, @object
_main©variable_info.names.31:
        .string "_₂₅"
        .size _main©variable_info.names.31, . - _main©variable_info.names.31

        .section .data
        .align 8
        .type _main©variable_info.names.32, @object
_main©variable_info.names.32:
        .string "_₂₆"
        .size _main©variable_info.names.32, . - _main©variable_info.names.32

        .section .data
        .align 8
        .type _main©variable_info.names.33, @object
_main©variable_info.names.33:
        .string "_₂₇"
        .size _main©variable_info.names.33, . - _main©variable_info.names.33

        .section .data
        .align 8
        .type _main©variable_info.names.34, @object
_main©variable_info.names.34:
        .string "_₂₈"
        .size _main©variable_info.names.34, . - _main©variable_info.names.34

        .section .data
        .align 8
        .type _main©variable_info.names.35, @object
_main©variable_info.names.35:
        .string "_₂₉"
        .size _main©variable_info.names.35, . - _main©variable_info.names.35

        .section .data
        .align 8
        .type _main©variable_info.names.36, @object
_main©variable_info.names.36:
        .string "_₃₀"
        .size _main©variable_info.names.36, . - _main©variable_info.names.36

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
        .type print©setup©variable_info, @object
print©setup©variable_info:
        .quad 3
        .quad print©setup©variable_info.names
        .size print©setup©variable_info, . - print©setup©variable_info

        .section .data
        .align 8
        .type print©setup©variable_info.names, @object
print©setup©variable_info.names:
        .quad print©setup©variable_info.names.0
        .quad print©setup©variable_info.names.1
        .quad print©setup©variable_info.names.2
        .size print©setup©variable_info.names, . - print©setup©variable_info.names

        .section .data
        .align 8
        .type print©setup©variable_info.names.0, @object
print©setup©variable_info.names.0:
        .string "address"
        .size print©setup©variable_info.names.0, . - print©setup©variable_info.names.0

        .section .data
        .align 8
        .type print©setup©variable_info.names.1, @object
print©setup©variable_info.names.1:
        .string "metadata"
        .size print©setup©variable_info.names.1, . - print©setup©variable_info.names.1

        .section .data
        .align 8
        .type print©setup©variable_info.names.2, @object
print©setup©variable_info.names.2:
        .string "function"
        .size print©setup©variable_info.names.2, . - print©setup©variable_info.names.2

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
        .type newline©setup©variable_info, @object
newline©setup©variable_info:
        .quad 3
        .quad newline©setup©variable_info.names
        .size newline©setup©variable_info, . - newline©setup©variable_info

        .section .data
        .align 8
        .type newline©setup©variable_info.names, @object
newline©setup©variable_info.names:
        .quad newline©setup©variable_info.names.0
        .quad newline©setup©variable_info.names.1
        .quad newline©setup©variable_info.names.2
        .size newline©setup©variable_info.names, . - newline©setup©variable_info.names

        .section .data
        .align 8
        .type newline©setup©variable_info.names.0, @object
newline©setup©variable_info.names.0:
        .string "address"
        .size newline©setup©variable_info.names.0, . - newline©setup©variable_info.names.0

        .section .data
        .align 8
        .type newline©setup©variable_info.names.1, @object
newline©setup©variable_info.names.1:
        .string "metadata"
        .size newline©setup©variable_info.names.1, . - newline©setup©variable_info.names.1

        .section .data
        .align 8
        .type newline©setup©variable_info.names.2, @object
newline©setup©variable_info.names.2:
        .string "function"
        .size newline©setup©variable_info.names.2, . - newline©setup©variable_info.names.2

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
