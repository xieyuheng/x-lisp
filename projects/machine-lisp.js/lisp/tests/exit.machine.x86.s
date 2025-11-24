.global _start

.text
.align 8
.type _start, @function
_start:
_start.entry:
        movq $60, %rax
        movq $6, %rdi
        syscall 
.size _start, . - _start

