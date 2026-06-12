(define-code test-conditional
  (block entry
    (mov (reg rax) (imm 10))
    (mov (reg rcx) (imm 3))
    (cmp (reg rax) (reg rcx))
    (j (cc g) (label is-greater))
    (mov (reg rax) (imm 0))
    (ret))
  (block is-greater
    (mov (reg rax) (imm 1))
    (ret)))
