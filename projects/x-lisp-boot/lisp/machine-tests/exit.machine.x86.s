.global _start

.align 8
.text
_start:
_start.entry:
        movq $60, %rax
        movq $6, %rdi
        syscall 
