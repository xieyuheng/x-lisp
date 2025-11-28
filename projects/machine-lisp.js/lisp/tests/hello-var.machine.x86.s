.global _start

.data
.align 8
.type _message, @object
_message:
        .string "Hello, World!\n"
.size _message, . - _message

.bss
.align 8
_message.length:
        .zero 8

.text
.align 8
.type _start, @function
_start:
_start.entry:
        movq $14, %rax
        movq %rax, _message.length(%rip)
        movq $1, %rax
        movq $1, %rdi
        leaq _message(%rip), %rsi
        movq _message.length(%rip), %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 
.size _start, . - _start
