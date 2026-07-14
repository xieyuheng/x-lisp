(define-code main
  (block entry
    (mov (reg rax) 1)
    (mov (reg rdi) 1)
    (mov (reg rsi) "hello world\n")
    (mov (reg rdx) 12)
    (syscall)
    (mov (reg rax) 0)
    (ret)))
