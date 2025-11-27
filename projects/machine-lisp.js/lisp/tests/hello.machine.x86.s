.global _start

.data
.align 8
.type _message, @object
_message:
_message.entry:
        .string "Hello, World!\n"
_message.length:
        .quad 14
.size _message, . - _message

.text
.align 8
.type _start, @function
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
.size _start, . - _start
