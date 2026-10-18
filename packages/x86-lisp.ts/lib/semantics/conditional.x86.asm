; Semantic: conditional branch — 10 > 3, takes is-greater path, returns 1
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   cmp reg, reg   — 3B /r  (REX.W + 3B + ModRM mod=3)
;   j cc label     — 0F 8x rel32  (condition code: g)
;   ret            — C3

(define-code main
  (mov (reg rax) 10)
  (mov (reg rcx) 3)
  (cmp (reg rax) (reg rcx))
  (j (cc g) (label is-greater))
  (mov (reg rax) 0)
  (ret)
  is-greater
  (mov (reg rax) 1)
  (ret))
