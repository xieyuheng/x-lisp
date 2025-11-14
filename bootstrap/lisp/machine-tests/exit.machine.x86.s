.global start

.text
start:
start.entry:
        movq $60, %rax
        movq $6, %rdi
        syscall 

