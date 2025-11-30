.global start

.data
.align 8
.type message, @object
message:
        .string "Hello, World!\n"
.size message, . - message

.data
.align 8
.type message.length, @object
message.length:
        .quad 14
.size message.length, . - message.length

.text
.align 8
.type start, @function
start:
start.entry:
        leaq message(%rip), %rsi
        nop 
        nop 
        nop 
        leaq message(%rip), %rdi
        movq $60, %rax
        subq %rsi, %rdi
        syscall 
.size start, . - start
