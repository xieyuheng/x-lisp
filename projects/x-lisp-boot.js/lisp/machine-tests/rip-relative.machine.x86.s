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
        leaq message(%rip), %rsi
        nop 
        nop 
        nop 
        leaq message(%rip), %rdi
        movq $60, %rax
        subq %rsi, %rdi
        syscall 
start.end:
        .size start, . - start
