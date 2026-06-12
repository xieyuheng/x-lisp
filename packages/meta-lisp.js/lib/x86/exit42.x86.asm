(define-code exit42
  (block entry
    (mov (reg rax) (imm 60))
    (mov (reg rdi) (imm 42))
    (syscall)))
