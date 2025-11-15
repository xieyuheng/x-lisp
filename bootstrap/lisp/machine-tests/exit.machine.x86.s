.global __start

.text
__start:
__start.entry:
        movq $60, %rax
        movq $6, %rdi
        syscall 
