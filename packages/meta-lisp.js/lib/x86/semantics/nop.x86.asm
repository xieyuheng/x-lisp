; Semantic: nop should not affect program state
;
; Encodings exercised:
;   nop — 90
;   mov reg, imm32
;   ret

(define-code test-nop
  (block entry
    (mov (reg rax) 7)
    (nop)
    (nop)
    (nop)
    (ret)))
