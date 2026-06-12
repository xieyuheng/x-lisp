; Semantic: conditional branch — 10 > 3, takes is-greater path, returns 1
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   cmp reg, reg   — 3B /r  (REX.W + 3B + ModRM mod=3)
;   j cc label     — 0F 8x rel32  (condition code: g)
;   ret            — C3

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
