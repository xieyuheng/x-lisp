;; nasm -f bin hello.nasm -o hello.nasm.x86.exe

bits 64

print_message:
    lea rsi, [rel message]
    mov edx, message_length
    mov edi, 1
    mov eax, 1
    syscall
    ret

message: db 'hello nams', 10
message_length equ $ - message
