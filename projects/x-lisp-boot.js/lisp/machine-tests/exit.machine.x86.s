        .global start

        .section .text
        .align 8
        .type start, @function
start:
start.entry:
        movq $60, %rax
        movq $6, %rdi
        syscall 
start.end:
        .size start, . - start
