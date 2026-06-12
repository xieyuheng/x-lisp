(define-code test-bitwise
  (block entry
    (mov (reg rax) (imm 255))
    (and (reg rax) (imm 15))
    (shl (reg rax) (imm 4))
    (or (reg rax) (imm 10))
    (ret)))
