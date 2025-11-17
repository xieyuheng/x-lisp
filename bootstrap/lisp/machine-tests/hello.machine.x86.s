.global _start

.align 8
.data
_message:
_message.entry:
        .ascii "Hello, World!\n"
_message.length:
        .quad 14

.align 8
.text
_start:
_start.entry:
        movq $1, %rax
        movq $1, %rdi
        movq $_message, %rsi
        movq $14, %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 
