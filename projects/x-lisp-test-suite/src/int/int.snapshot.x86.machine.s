        .global _setup
        .global _main

        .section .text
        .align 8
        .type square, @function
square:
square.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp square.body
square.body:
        movq %rdi, -8(%rbp)
        movq imul©constant(%rip), %rax
        movq %rax, -16(%rbp)
        movq -16(%rbp), %rdi
        movq -8(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rdi
        movq -8(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -32(%rbp)
        movq -32(%rbp), %rax
        jmp square.epilog
square.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
square.end:
        .size square, . - square

        .section .data
        .align 8
        .type square©metadata, @object
square©metadata:
        .quad square©metadata.name
        .quad 1
        .quad 0
        .quad square©variable_info
        .quad square
        .quad square.end
        .size square©metadata, . - square©metadata

        .section .data
        .align 8
        .type square©metadata.name, @object
square©metadata.name:
        .string "square"
        .size square©metadata.name, . - square©metadata.name

        .section .bss
        .align 8
square©constant:
        .zero 8

        .section .text
        .align 8
        .type square©setup, @function
square©setup:
square©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp square©setup.body
square©setup.body:
        movq $square, -8(%rbp)
        orq $3, -8(%rbp)
        movq $square©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, square©constant(%rip)
        jmp square©setup.epilog
square©setup.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
square©setup.end:
        .size square©setup, . - square©setup

        .section .text
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
        movq square©constant(%rip), %rax
        movq %rax, -16(%rbp)
        movq $24, -24(%rbp)
        movq -16(%rbp), %rdi
        movq -24(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -32(%rbp)
        movq -8(%rbp), %rdi
        movq -32(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -40(%rbp)
        movq -40(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $48, %rsp
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
        .type imul©metadata, @object
imul©metadata:
        .quad imul©metadata.name
        .quad 2
        .quad 1
        .quad 0
        .quad 0
        .quad 0
        .size imul©metadata, . - imul©metadata

        .section .data
        .align 8
        .type imul©metadata.name, @object
imul©metadata.name:
        .string "imul"
        .size imul©metadata.name, . - imul©metadata.name

        .section .bss
        .align 8
imul©constant:
        .zero 8

        .section .text
        .align 8
        .type imul©setup, @function
imul©setup:
imul©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        subq $32, %rsp
        jmp imul©setup.body
imul©setup.body:
        movq $x_imul, -8(%rbp)
        orq $3, -8(%rbp)
        movq $imul©metadata, -16(%rbp)
        orq $3, -16(%rbp)
        movq -8(%rbp), %rdi
        movq -16(%rbp), %rsi
        callq x_make_function
        movq %rax, -24(%rbp)
        movq -24(%rbp), %rax
        movq %rax, imul©constant(%rip)
        jmp imul©setup.epilog
imul©setup.epilog:
        addq $32, %rsp
        popq %rbp
        retq 
imul©setup.end:
        .size imul©setup, . - imul©setup

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
        .quad 1
        .quad _function_table.entries
        .size _function_table, . - _function_table

        .section .data
        .align 8
        .type _function_table.entries, @object
_function_table.entries:
        .quad square©metadata
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
        callq square©setup
        movq %rax, -8(%rbp)
        callq _main©setup
        movq %rax, -8(%rbp)
        callq println_non_void©setup
        movq %rax, -8(%rbp)
        callq imul©setup
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
        .type square©variable_info, @object
square©variable_info:
        .quad 4
        .quad square©variable_info.names
        .size square©variable_info, . - square©variable_info

        .section .data
        .align 8
        .type square©variable_info.names, @object
square©variable_info.names:
        .quad square©variable_info.names.0
        .quad square©variable_info.names.1
        .quad square©variable_info.names.2
        .quad square©variable_info.names.3
        .size square©variable_info.names, . - square©variable_info.names

        .section .data
        .align 8
        .type square©variable_info.names.0, @object
square©variable_info.names.0:
        .string "x"
        .size square©variable_info.names.0, . - square©variable_info.names.0

        .section .data
        .align 8
        .type square©variable_info.names.1, @object
square©variable_info.names.1:
        .string "_₁"
        .size square©variable_info.names.1, . - square©variable_info.names.1

        .section .data
        .align 8
        .type square©variable_info.names.2, @object
square©variable_info.names.2:
        .string "_₂"
        .size square©variable_info.names.2, . - square©variable_info.names.2

        .section .data
        .align 8
        .type square©variable_info.names.3, @object
square©variable_info.names.3:
        .string "_↩"
        .size square©variable_info.names.3, . - square©variable_info.names.3

        .section .data
        .align 8
        .type square©setup©variable_info, @object
square©setup©variable_info:
        .quad 3
        .quad square©setup©variable_info.names
        .size square©setup©variable_info, . - square©setup©variable_info

        .section .data
        .align 8
        .type square©setup©variable_info.names, @object
square©setup©variable_info.names:
        .quad square©setup©variable_info.names.0
        .quad square©setup©variable_info.names.1
        .quad square©setup©variable_info.names.2
        .size square©setup©variable_info.names, . - square©setup©variable_info.names

        .section .data
        .align 8
        .type square©setup©variable_info.names.0, @object
square©setup©variable_info.names.0:
        .string "address"
        .size square©setup©variable_info.names.0, . - square©setup©variable_info.names.0

        .section .data
        .align 8
        .type square©setup©variable_info.names.1, @object
square©setup©variable_info.names.1:
        .string "metadata"
        .size square©setup©variable_info.names.1, . - square©setup©variable_info.names.1

        .section .data
        .align 8
        .type square©setup©variable_info.names.2, @object
square©setup©variable_info.names.2:
        .string "function"
        .size square©setup©variable_info.names.2, . - square©setup©variable_info.names.2

        .section .data
        .align 8
        .type _main©variable_info, @object
_main©variable_info:
        .quad 5
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
        .string "_₂"
        .size _main©variable_info.names.1, . - _main©variable_info.names.1

        .section .data
        .align 8
        .type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "_₃"
        .size _main©variable_info.names.2, . - _main©variable_info.names.2

        .section .data
        .align 8
        .type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_₄"
        .size _main©variable_info.names.3, . - _main©variable_info.names.3

        .section .data
        .align 8
        .type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "_↩"
        .size _main©variable_info.names.4, . - _main©variable_info.names.4

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
        .type imul©setup©variable_info, @object
imul©setup©variable_info:
        .quad 3
        .quad imul©setup©variable_info.names
        .size imul©setup©variable_info, . - imul©setup©variable_info

        .section .data
        .align 8
        .type imul©setup©variable_info.names, @object
imul©setup©variable_info.names:
        .quad imul©setup©variable_info.names.0
        .quad imul©setup©variable_info.names.1
        .quad imul©setup©variable_info.names.2
        .size imul©setup©variable_info.names, . - imul©setup©variable_info.names

        .section .data
        .align 8
        .type imul©setup©variable_info.names.0, @object
imul©setup©variable_info.names.0:
        .string "address"
        .size imul©setup©variable_info.names.0, . - imul©setup©variable_info.names.0

        .section .data
        .align 8
        .type imul©setup©variable_info.names.1, @object
imul©setup©variable_info.names.1:
        .string "metadata"
        .size imul©setup©variable_info.names.1, . - imul©setup©variable_info.names.1

        .section .data
        .align 8
        .type imul©setup©variable_info.names.2, @object
imul©setup©variable_info.names.2:
        .string "function"
        .size imul©setup©variable_info.names.2, . - imul©setup©variable_info.names.2

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
