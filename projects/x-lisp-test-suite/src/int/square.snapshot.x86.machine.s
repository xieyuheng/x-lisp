.global _setup
.global _main

.text
.align 8
.type _main, @function
_main:
_main.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $112, %rsp
        jmp _main.body
_main.body:
        movq println_non_void©constant(%rip), %rax
        movq %rax, -64(%rbp)
        movq §₁.square©constant(%rip), %rax
        movq %rax, -72(%rbp)
        movq §₁.square©constant(%rip), %rax
        movq %rax, -80(%rbp)
        movq $24, -88(%rbp)
        movq -80(%rbp), %rdi
        movq -88(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -96(%rbp)
        movq -72(%rbp), %rdi
        movq -96(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -104(%rbp)
        movq -64(%rbp), %rdi
        movq -104(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -112(%rbp)
        movq -112(%rbp), %rax
        jmp _main.epilog
_main.epilog:
        addq $112, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _main, . - _main

.data
.align 8
.type _main©metadata, @object
_main©metadata:
        .quad _main©metadata.name
        .quad 0
        .quad 0
        .quad _main©variable_info
.size _main©metadata, . - _main©metadata

.data
.align 8
.type _main©metadata.name, @object
_main©metadata.name:
        .string "_main"
.size _main©metadata.name, . - _main©metadata.name

.data
.align 8
.type _main©variable_info, @object
_main©variable_info:
        .quad 7
        .quad _main©variable_info.names
.size _main©variable_info, . - _main©variable_info

.bss
.align 8
_main©constant:
        .zero 8

.text
.align 8
.type _main©setup, @function
_main©setup:
_main©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp _main©setup.body
_main©setup.body:
        movq $_main, -64(%rbp)
        orq $3, -64(%rbp)
        movq $_main©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, _main©constant(%rip)
        jmp _main©setup.epilog
_main©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _main©setup, . - _main©setup

.text
.align 8
.type §₁.square, @function
§₁.square:
§₁.square.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $88, %rsp
        jmp §₁.square.body
§₁.square.body:
        movq %rdi, -64(%rbp)
        movq imul©constant(%rip), %rax
        movq %rax, -72(%rbp)
        movq -72(%rbp), %rdi
        movq -64(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rdi
        movq -64(%rbp), %rsi
        callq x_apply_unary
        movq %rax, -88(%rbp)
        movq -88(%rbp), %rax
        jmp §₁.square.epilog
§₁.square.epilog:
        addq $88, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size §₁.square, . - §₁.square

.data
.align 8
.type §₁.square©metadata, @object
§₁.square©metadata:
        .quad §₁.square©metadata.name
        .quad 1
        .quad 0
        .quad §₁.square©variable_info
.size §₁.square©metadata, . - §₁.square©metadata

.data
.align 8
.type §₁.square©metadata.name, @object
§₁.square©metadata.name:
        .string "square"
.size §₁.square©metadata.name, . - §₁.square©metadata.name

.data
.align 8
.type §₁.square©variable_info, @object
§₁.square©variable_info:
        .quad 4
        .quad §₁.square©variable_info.names
.size §₁.square©variable_info, . - §₁.square©variable_info

.bss
.align 8
§₁.square©constant:
        .zero 8

.text
.align 8
.type §₁.square©setup, @function
§₁.square©setup:
§₁.square©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp §₁.square©setup.body
§₁.square©setup.body:
        movq $§₁.square, -64(%rbp)
        orq $3, -64(%rbp)
        movq $§₁.square©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, §₁.square©constant(%rip)
        jmp §₁.square©setup.epilog
§₁.square©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size §₁.square©setup, . - §₁.square©setup

.data
.align 8
.type println_non_void©metadata, @object
println_non_void©metadata:
        .quad println_non_void©metadata.name
        .quad 1
        .quad 1
        .quad 0
.size println_non_void©metadata, . - println_non_void©metadata

.data
.align 8
.type println_non_void©metadata.name, @object
println_non_void©metadata.name:
        .string "println-non-void"
.size println_non_void©metadata.name, . - println_non_void©metadata.name

.bss
.align 8
println_non_void©constant:
        .zero 8

.text
.align 8
.type println_non_void©setup, @function
println_non_void©setup:
println_non_void©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp println_non_void©setup.body
println_non_void©setup.body:
        movq $x_println_non_void, -64(%rbp)
        orq $3, -64(%rbp)
        movq $println_non_void©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, println_non_void©constant(%rip)
        jmp println_non_void©setup.epilog
println_non_void©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size println_non_void©setup, . - println_non_void©setup

.data
.align 8
.type imul©metadata, @object
imul©metadata:
        .quad imul©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size imul©metadata, . - imul©metadata

.data
.align 8
.type imul©metadata.name, @object
imul©metadata.name:
        .string "imul"
.size imul©metadata.name, . - imul©metadata.name

.bss
.align 8
imul©constant:
        .zero 8

.text
.align 8
.type imul©setup, @function
imul©setup:
imul©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp imul©setup.body
imul©setup.body:
        movq $x_imul, -64(%rbp)
        orq $3, -64(%rbp)
        movq $imul©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, imul©constant(%rip)
        jmp imul©setup.epilog
imul©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size imul©setup, . - imul©setup

.data
.align 8
.type make_function©metadata, @object
make_function©metadata:
        .quad make_function©metadata.name
        .quad 2
        .quad 1
        .quad 0
.size make_function©metadata, . - make_function©metadata

.data
.align 8
.type make_function©metadata.name, @object
make_function©metadata.name:
        .string "make-function"
.size make_function©metadata.name, . - make_function©metadata.name

.bss
.align 8
make_function©constant:
        .zero 8

.text
.align 8
.type make_function©setup, @function
make_function©setup:
make_function©setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $80, %rsp
        jmp make_function©setup.body
make_function©setup.body:
        movq $x_make_function, -64(%rbp)
        orq $3, -64(%rbp)
        movq $make_function©metadata, -72(%rbp)
        orq $3, -72(%rbp)
        movq -64(%rbp), %rdi
        movq -72(%rbp), %rsi
        callq x_make_function
        movq %rax, -80(%rbp)
        movq -80(%rbp), %rax
        movq %rax, make_function©constant(%rip)
        jmp make_function©setup.epilog
make_function©setup.epilog:
        addq $80, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size make_function©setup, . - make_function©setup

.text
.align 8
.type _setup, @function
_setup:
_setup.prolog:
        pushq %rbp
        movq %rsp, %rbp
        pushq %rsp
        pushq %rbp
        pushq %rbx
        pushq %r12
        pushq %r13
        pushq %r14
        pushq %r15
        subq $64, %rsp
        jmp _setup.body
_setup.body:
        callq _main©setup
        movq %rax, -64(%rbp)
        callq §₁.square©setup
        movq %rax, -64(%rbp)
        callq println_non_void©setup
        movq %rax, -64(%rbp)
        callq imul©setup
        movq %rax, -64(%rbp)
        callq make_function©setup
        movq %rax, -64(%rbp)
_setup.epilog:
        addq $64, %rsp
        popq %r15
        popq %r14
        popq %r13
        popq %r12
        popq %rbx
        popq %rbp
        popq %rsp
        popq %rbp
        retq 
.size _setup, . - _setup

.data
.align 8
.type _main©variable_info.names, @object
_main©variable_info.names:
        .quad _main©variable_info.names.0
        .quad _main©variable_info.names.1
        .quad _main©variable_info.names.2
        .quad _main©variable_info.names.3
        .quad _main©variable_info.names.4
        .quad _main©variable_info.names.5
        .quad _main©variable_info.names.6
.size _main©variable_info.names, . - _main©variable_info.names

.data
.align 8
.type _main©variable_info.names.0, @object
_main©variable_info.names.0:
        .string "_₁"
.size _main©variable_info.names.0, . - _main©variable_info.names.0

.data
.align 8
.type _main©variable_info.names.1, @object
_main©variable_info.names.1:
        .string "_₂"
.size _main©variable_info.names.1, . - _main©variable_info.names.1

.data
.align 8
.type _main©variable_info.names.2, @object
_main©variable_info.names.2:
        .string "_₃"
.size _main©variable_info.names.2, . - _main©variable_info.names.2

.data
.align 8
.type _main©variable_info.names.3, @object
_main©variable_info.names.3:
        .string "_₄"
.size _main©variable_info.names.3, . - _main©variable_info.names.3

.data
.align 8
.type _main©variable_info.names.4, @object
_main©variable_info.names.4:
        .string "_₅"
.size _main©variable_info.names.4, . - _main©variable_info.names.4

.data
.align 8
.type _main©variable_info.names.5, @object
_main©variable_info.names.5:
        .string "_₆"
.size _main©variable_info.names.5, . - _main©variable_info.names.5

.data
.align 8
.type _main©variable_info.names.6, @object
_main©variable_info.names.6:
        .string "_↩"
.size _main©variable_info.names.6, . - _main©variable_info.names.6

.data
.align 8
.type _main©setup©variable_info, @object
_main©setup©variable_info:
        .quad 3
        .quad _main©setup©variable_info.names
.size _main©setup©variable_info, . - _main©setup©variable_info

.data
.align 8
.type _main©setup©variable_info.names, @object
_main©setup©variable_info.names:
        .quad _main©setup©variable_info.names.0
        .quad _main©setup©variable_info.names.1
        .quad _main©setup©variable_info.names.2
.size _main©setup©variable_info.names, . - _main©setup©variable_info.names

.data
.align 8
.type _main©setup©variable_info.names.0, @object
_main©setup©variable_info.names.0:
        .string "address"
.size _main©setup©variable_info.names.0, . - _main©setup©variable_info.names.0

.data
.align 8
.type _main©setup©variable_info.names.1, @object
_main©setup©variable_info.names.1:
        .string "metadata"
.size _main©setup©variable_info.names.1, . - _main©setup©variable_info.names.1

.data
.align 8
.type _main©setup©variable_info.names.2, @object
_main©setup©variable_info.names.2:
        .string "function"
.size _main©setup©variable_info.names.2, . - _main©setup©variable_info.names.2

.data
.align 8
.type §₁.square©variable_info.names, @object
§₁.square©variable_info.names:
        .quad §₁.square©variable_info.names.0
        .quad §₁.square©variable_info.names.1
        .quad §₁.square©variable_info.names.2
        .quad §₁.square©variable_info.names.3
.size §₁.square©variable_info.names, . - §₁.square©variable_info.names

.data
.align 8
.type §₁.square©variable_info.names.0, @object
§₁.square©variable_info.names.0:
        .string "x"
.size §₁.square©variable_info.names.0, . - §₁.square©variable_info.names.0

.data
.align 8
.type §₁.square©variable_info.names.1, @object
§₁.square©variable_info.names.1:
        .string "_₁"
.size §₁.square©variable_info.names.1, . - §₁.square©variable_info.names.1

.data
.align 8
.type §₁.square©variable_info.names.2, @object
§₁.square©variable_info.names.2:
        .string "_₂"
.size §₁.square©variable_info.names.2, . - §₁.square©variable_info.names.2

.data
.align 8
.type §₁.square©variable_info.names.3, @object
§₁.square©variable_info.names.3:
        .string "_↩"
.size §₁.square©variable_info.names.3, . - §₁.square©variable_info.names.3

.data
.align 8
.type §₁.square©setup©variable_info, @object
§₁.square©setup©variable_info:
        .quad 3
        .quad §₁.square©setup©variable_info.names
.size §₁.square©setup©variable_info, . - §₁.square©setup©variable_info

.data
.align 8
.type §₁.square©setup©variable_info.names, @object
§₁.square©setup©variable_info.names:
        .quad §₁.square©setup©variable_info.names.0
        .quad §₁.square©setup©variable_info.names.1
        .quad §₁.square©setup©variable_info.names.2
.size §₁.square©setup©variable_info.names, . - §₁.square©setup©variable_info.names

.data
.align 8
.type §₁.square©setup©variable_info.names.0, @object
§₁.square©setup©variable_info.names.0:
        .string "address"
.size §₁.square©setup©variable_info.names.0, . - §₁.square©setup©variable_info.names.0

.data
.align 8
.type §₁.square©setup©variable_info.names.1, @object
§₁.square©setup©variable_info.names.1:
        .string "metadata"
.size §₁.square©setup©variable_info.names.1, . - §₁.square©setup©variable_info.names.1

.data
.align 8
.type §₁.square©setup©variable_info.names.2, @object
§₁.square©setup©variable_info.names.2:
        .string "function"
.size §₁.square©setup©variable_info.names.2, . - §₁.square©setup©variable_info.names.2

.data
.align 8
.type println_non_void©setup©variable_info, @object
println_non_void©setup©variable_info:
        .quad 3
        .quad println_non_void©setup©variable_info.names
.size println_non_void©setup©variable_info, . - println_non_void©setup©variable_info

.data
.align 8
.type println_non_void©setup©variable_info.names, @object
println_non_void©setup©variable_info.names:
        .quad println_non_void©setup©variable_info.names.0
        .quad println_non_void©setup©variable_info.names.1
        .quad println_non_void©setup©variable_info.names.2
.size println_non_void©setup©variable_info.names, . - println_non_void©setup©variable_info.names

.data
.align 8
.type println_non_void©setup©variable_info.names.0, @object
println_non_void©setup©variable_info.names.0:
        .string "address"
.size println_non_void©setup©variable_info.names.0, . - println_non_void©setup©variable_info.names.0

.data
.align 8
.type println_non_void©setup©variable_info.names.1, @object
println_non_void©setup©variable_info.names.1:
        .string "metadata"
.size println_non_void©setup©variable_info.names.1, . - println_non_void©setup©variable_info.names.1

.data
.align 8
.type println_non_void©setup©variable_info.names.2, @object
println_non_void©setup©variable_info.names.2:
        .string "function"
.size println_non_void©setup©variable_info.names.2, . - println_non_void©setup©variable_info.names.2

.data
.align 8
.type imul©setup©variable_info, @object
imul©setup©variable_info:
        .quad 3
        .quad imul©setup©variable_info.names
.size imul©setup©variable_info, . - imul©setup©variable_info

.data
.align 8
.type imul©setup©variable_info.names, @object
imul©setup©variable_info.names:
        .quad imul©setup©variable_info.names.0
        .quad imul©setup©variable_info.names.1
        .quad imul©setup©variable_info.names.2
.size imul©setup©variable_info.names, . - imul©setup©variable_info.names

.data
.align 8
.type imul©setup©variable_info.names.0, @object
imul©setup©variable_info.names.0:
        .string "address"
.size imul©setup©variable_info.names.0, . - imul©setup©variable_info.names.0

.data
.align 8
.type imul©setup©variable_info.names.1, @object
imul©setup©variable_info.names.1:
        .string "metadata"
.size imul©setup©variable_info.names.1, . - imul©setup©variable_info.names.1

.data
.align 8
.type imul©setup©variable_info.names.2, @object
imul©setup©variable_info.names.2:
        .string "function"
.size imul©setup©variable_info.names.2, . - imul©setup©variable_info.names.2

.data
.align 8
.type make_function©setup©variable_info, @object
make_function©setup©variable_info:
        .quad 3
        .quad make_function©setup©variable_info.names
.size make_function©setup©variable_info, . - make_function©setup©variable_info

.data
.align 8
.type make_function©setup©variable_info.names, @object
make_function©setup©variable_info.names:
        .quad make_function©setup©variable_info.names.0
        .quad make_function©setup©variable_info.names.1
        .quad make_function©setup©variable_info.names.2
.size make_function©setup©variable_info.names, . - make_function©setup©variable_info.names

.data
.align 8
.type make_function©setup©variable_info.names.0, @object
make_function©setup©variable_info.names.0:
        .string "address"
.size make_function©setup©variable_info.names.0, . - make_function©setup©variable_info.names.0

.data
.align 8
.type make_function©setup©variable_info.names.1, @object
make_function©setup©variable_info.names.1:
        .string "metadata"
.size make_function©setup©variable_info.names.1, . - make_function©setup©variable_info.names.1

.data
.align 8
.type make_function©setup©variable_info.names.2, @object
make_function©setup©variable_info.names.2:
        .string "function"
.size make_function©setup©variable_info.names.2, . - make_function©setup©variable_info.names.2

.data
.align 8
.type _setup©variable_info, @object
_setup©variable_info:
        .quad 1
        .quad _setup©variable_info.names
.size _setup©variable_info, . - _setup©variable_info

.data
.align 8
.type _setup©variable_info.names, @object
_setup©variable_info.names:
        .quad _setup©variable_info.names.0
.size _setup©variable_info.names, . - _setup©variable_info.names

.data
.align 8
.type _setup©variable_info.names.0, @object
_setup©variable_info.names.0:
        .string "_"
.size _setup©variable_info.names.0, . - _setup©variable_info.names.0
