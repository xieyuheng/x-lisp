.global _start

.data
_message:
_message.entry:
        .ascii "Hello, World!\n"
_message.length:
        .quad 14

.text
_start:
_start.entry:
        leaq _message(%rip), %rsi
        nop 
        nop 
        nop 
        leaq _message(%rip), %rdi
        movq $60, %rax
        subq %rsi, %rdi
        syscall 
