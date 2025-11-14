.global _start

.data
message:
message.entry:
        .ascii "Hello, World!\n"
message.length:
        .quad 14

.text
_start:
_start.entry:
        movq $1, %rax
        movq $1, %rdi
        movq $message, %rsi
        movq $14, %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 
