        .global start

        .section .data
        .align 8
        .type message, @object
message:
        .string "Hello, World!\n"
        .size message, . - message

        .section .bss
        .align 8
message.length:
        .zero 8

        .section .text
        .align 8
        .type start, @function
start:
start.entry:
        movq $14, %rax
        movq %rax, message.length(%rip)
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
