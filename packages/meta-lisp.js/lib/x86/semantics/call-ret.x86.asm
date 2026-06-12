; Semantic: direct call + return — helper returns 1, test-call adds 40 → 41
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   call label     — E8 rel32
;   add reg, imm8  — 83 /0
;   ret            — C3

(define-code helper
  (block entry
    (mov (reg rax) (imm 1))
    (ret)))

(define-code test-call
  (block entry
    (call (label helper))
    (add (reg rax) (imm 40))
    (ret)))
