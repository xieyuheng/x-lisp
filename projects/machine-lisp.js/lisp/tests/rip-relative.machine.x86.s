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
        leaq _message(%rip), %rsi
        nop 
        nop 
        nop 
        leaq _message(%rip), %rdi
        movq $60, %rax
        subq %rsi, %rdi
        syscall 
.size _start, . - _start
