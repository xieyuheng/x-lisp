(define-data message "hello world\n")

(define-code main
  (block entry
    (mov (reg rax) 1)
    (mov (reg rdx) 1)
    (lea (reg rsi) (address message))
    (mov (reg rdx) 12)
    (syscall)
    (mov (reg rax) 0)
    (ret)))
