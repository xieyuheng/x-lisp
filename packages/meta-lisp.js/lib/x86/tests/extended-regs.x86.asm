(define-code test-extended
  (block entry
    (mov (reg r8) (imm 7))
    (mov (reg r9) (imm 11))
    (add (reg r8) (reg r9))
    (mov (reg rax) (reg r8))
    (ret)))
