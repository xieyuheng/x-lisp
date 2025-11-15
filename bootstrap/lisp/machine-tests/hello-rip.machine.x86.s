.global __start

.data
_message:
_message.entry:
        .ascii "Hello, World!\n"
_message.length:
        .quad 14

.text
__start:
__start.entry:
        movq $1, %rax
        movq $1, %rdi
        leaq _message(%rip), %rsi
        movq _message.length(%rip), %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 
