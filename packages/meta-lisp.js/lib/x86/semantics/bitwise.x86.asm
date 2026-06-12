; Semantic: bitwise chain — (255 & 15) << 4 | 10 = (15 << 4) | 10 = 250
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   and reg, imm8  — 83 /4  (REX.W + 83 + ModRM mod=3 reg=4 rm=r + imm8)
;   shl reg, imm8  — C1 /4  (REX.W + C1 + ModRM mod=3 reg=4 rm=r + imm8)
;   or  reg, imm8  — 83 /1  (REX.W + 83 + ModRM mod=3 reg=1 rm=r + imm8)
;   ret            — C3

(define-code test-bitwise
  (block entry
    (mov (reg rax) (imm 255))
    (and (reg rax) (imm 15))
    (shl (reg rax) (imm 4))
    (or (reg rax) (imm 10))
    (ret)))
