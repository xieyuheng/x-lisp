; Semantic: arithmetic chain — (10+20+5) → 35
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0  (REX.W + C7 + ModRM mod=3 reg=0 rm=r + imm32)
;   add reg, imm8  — 83 /0  (REX.W + 83 + ModRM mod=3 reg=0 rm=r + imm8)
;   add reg, imm32 — 81 /0  (REX.W + 81 + ModRM mod=3 reg=0 rm=r + imm32)
;   ret            — C3

(define-code test-add
  (block entry
    (mov (reg rax) (imm 10))
    (add (reg rax) (imm 20))
    (add (reg rax) (imm 5))
    (ret)))
