(define-code test-stack
  (block entry
    (mov (reg rax) (imm 100))
    (push (reg rax))
    (mov (reg rax) (imm 0))
    (pop (reg rax))
    (ret)))
