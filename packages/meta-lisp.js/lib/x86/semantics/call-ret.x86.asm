; Semantic: direct call + return — main returns 1, helper returns 41 (1+40)
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   call label     — E8 rel32
;   add reg, imm8  — 83 /0
;   ret            — C3

(define-code main
  (block entry
    (call (label helper))
    (add (reg rax) 40)
    (ret)))

(define-code helper
  (block entry
    (mov (reg rax) 1)
    (ret)))
