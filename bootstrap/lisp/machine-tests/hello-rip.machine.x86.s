.global start

.data
message:
message.entry:
        .ascii "Hello, World!\n"
message.length:
        .quad 14

.text
start:
start.entry:
        movq $1, %rax
        movq $1, %rdi
        leaq message(%rip), %rsi
        movq message.length(%rip), %rdx
        syscall 
        movq $60, %rax
        movq $0, %rdi
        syscall 

