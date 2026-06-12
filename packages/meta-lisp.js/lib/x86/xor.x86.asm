(define-code test-xor
  (block entry
    (xor (reg rax) (reg rax))
    (mov (reg rax) (imm 7))
    (xor (reg rax) (reg rax))
    (mov (reg rax) (imm 3))
    (ret)))
