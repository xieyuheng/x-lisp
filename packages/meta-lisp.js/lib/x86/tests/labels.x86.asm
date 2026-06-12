(define-code test-labels
  (block entry
    (mov (reg rax) (imm 0))
    (jmp (label done))
    (mov (reg rax) (imm 99))
    (ret))
  (block done
    (ret)))
