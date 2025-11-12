        .global _start

.text
_start:
_start.entry:
        movq $60, %rax
        movq $6, %rdi
        syscall 
