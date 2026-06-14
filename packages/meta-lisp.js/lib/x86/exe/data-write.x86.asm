; Semantic: write to data field via LEA + MOV [reg], imm, then read back
;
; Encodings exercised:
;   lea reg, label-deref  — 8D /r with RIP-relative  (load field address)
;   mov [reg], imm        — C7 /0 with mod=00 rm=reg   (write to field)
;   mov reg, label-deref  — 8B /r with RIP-relative  (read from field)

(define-struct counter-t
  (value int64-t))

(claim my-counter counter-t)
(define-data my-counter
  (value 0))

(define-code test-write-read
  (block entry
    (lea (reg rax) (label-deref (label my-counter value)))
    (mov (reg-deref (reg rax)) (imm 42))
    (mov (reg rax) (label-deref (label my-counter value)))
    (ret)))
