        .global _start

.data
_message:
_message.entry:
        .ascii "Hello, World!\n"

.text
_start:
_start.entry:
        movq $1, %rax
        movq $1, %rdi
        movq $_message.entry, %rsi
        movq $14, %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 
