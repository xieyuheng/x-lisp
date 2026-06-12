; Semantic: unconditional forward jump — skips dead mov, rax stays 0
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   jmp label      — E9 rel32
;   ret            — C3
;
; Labels: block names only (no bare-symbol labels)

(define-code test-labels
  (block entry
    (mov (reg rax) (imm 0))
    (jmp (label done))
    (mov (reg rax) (imm 99))
    (ret))
  (block done
    (ret)))
