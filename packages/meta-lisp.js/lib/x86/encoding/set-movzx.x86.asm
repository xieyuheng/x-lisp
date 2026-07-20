; SETcc and MOVZX encodings
;
; SETcc r/m8:
;   0F 9x /0 — SETcc r/m8  (x = condition code from CC_CODES)
;   g  → 0F 9F C0  (setg al)
;   e  → 0F 94 C1  (sete cl)
;   l  → 0F 9C C3  (setl bl)
;   ne → 0F 95 C0  (setne al)
;   le → 0F 9E C0  (setle al)
;   ge → 0F 9D C0  (setge al)
;
; MOVZX r64, r/m8:
;   REX.W + 0F B6 /r — MOVZX r64, r/m8
;   48 0F B6 C0  (movzx rax, al)
;   48 0F B6 C1  (movzx rax, cl)

(define-code main
  (block entry
    (mov (reg rax) 10)
    (mov (reg rcx) 5)
    (cmp (reg rax) (reg rcx))
    (set (cc g) (reg al))
    (movzx (reg rax) (reg al))
    (ret)))
