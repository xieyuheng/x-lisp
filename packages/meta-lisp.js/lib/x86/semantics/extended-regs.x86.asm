; Semantic: extended registers r8-r9 — compute (7+11) → 18
;
; Encodings exercised:
;   mov r8, imm32  — C7 /0 with REX.B  (49 C7 C0 ...)
;   mov r9, imm32  — C7 /0 with REX.B  (49 C7 C1 ...)
;   add r8, r9     — 03 /r with REX.R + REX.B  (4D 03 C1)
;   mov rax, r8    — 8B /r with REX.B  (49 8B C0)
;   ret            — C3
;
; REX.R = extends ModRM.reg; REX.B = extends ModRM.rm or SIB.base

(define-code test-extended
  (block entry
    (mov (reg r8) (imm 7))
    (mov (reg r9) (imm 11))
    (add (reg r8) (reg r9))
    (mov (reg rax) (reg r8))
    (ret)))
