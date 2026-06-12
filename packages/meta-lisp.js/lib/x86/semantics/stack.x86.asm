; Semantic: push/pop preserves value — push 100, zero rax, pop → 100
;
; Encodings exercised:
;   mov reg, imm32 — C7 /0
;   push reg       — 50+r  (REX.B if extended register)
;   pop reg        — 58+r
;   ret            — C3

(define-code test-stack
  (block entry
    (mov (reg rax) (imm 100))
    (push (reg rax))
    (mov (reg rax) (imm 0))
    (pop (reg rax))
    (ret)))
