; Semantic: simplest function — immediate-to-register move + return → 42
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0  (REX.W + C7 + ModRM mod=3 reg=0 rm=r + imm32)
;   ret            — C3

(define-code return42
  (block entry
    (mov (reg rax) 42)
    (ret)))
