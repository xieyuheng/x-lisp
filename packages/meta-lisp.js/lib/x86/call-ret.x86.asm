(define-code helper
  (block entry
    (mov (reg rax) (imm 1))
    (ret)))

(define-code test-call
  (block entry
    (call (label helper))
    (add (reg rax) (imm 40))
    (ret)))
