// Minimal ELF entry for x86-lisp semantics tests.
//
// Calls the x86-lisp `main` (System V AMD64 ABI), then passes its
// return value to `print_and_exit`, which prints it as a decimal
// followed by a newline and exits via sys_exit.

.global _start

.text
_start:
    call main
    mov %rax, %rdi
    call print_and_exit
    hlt
