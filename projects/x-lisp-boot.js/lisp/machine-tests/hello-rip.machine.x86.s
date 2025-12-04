        .global start

        .section .data
        .align 8
        .type message, @object
message:
        .string "Hello, World!\n"
        .size message, . - message

        .section .data
        .align 8
        .type message.length, @object
message.length:
        .quad 14
        .size message.length, . - message.length

        .section .text
        .align 8
        .type start, @function
start:
start.entry:
        movq $1, %rax
        movq $1, %rdi
        leaq message(%rip), %rsi
        movq message.length(%rip), %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 
start.end:
        .size start, . - start
