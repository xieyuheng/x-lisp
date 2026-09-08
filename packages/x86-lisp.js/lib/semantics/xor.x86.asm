; Semantic: xor zeroing + value assignment — rax → 3
;
; Encodings exercised:
;   xor reg, reg   — 33 /r  (REX.W + 33 + ModRM mod=3)
;   mov reg, imm32 — C7 /0
;   ret            — C3

(define-code main
  (xor (reg rax) (reg rax))
  (mov (reg rax) 7)
  (xor (reg rax) (reg rax))
  (mov (reg rax) 3)
  (ret))
