(define-code test-add
  (block entry
    (mov (reg rax) (imm 10))
    (add (reg rax) (imm 20))
    (add (reg rax) (imm 5))
    (ret)))
