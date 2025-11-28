.global _start

.data
.align 8
.type _message, @object
_message:
        .string "Hello, World!\n"
.size _message, . - _message

.data
.align 8
.type _message.length, @object
_message.length:
        .quad 14
.size _message.length, . - _message.length

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
