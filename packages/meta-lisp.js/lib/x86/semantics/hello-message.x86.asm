(define-data message "hello message\n")

(define-code main
  (mov (reg rax) 1)
  (mov (reg rdi) 1)
  (mov (reg rsi) (address message))
  (mov (reg rsi) (deref (reg rsi)))
  (mov (reg rdx) 14)
  (syscall)
  (ret))
