; x86.exe: multiple define-code each with own define-metadata
;
; func-b (entry) has metadata arity=3, reads its own via -8 slot → 3
; func-a has metadata arity=5 (but not entry)

(define-struct func-meta-t
  (arity int64-t))

(claim-code-metadata func-meta-t)

(define-metadata func-b
  (arity 3))

(define-code func-b
  (block entry
    (mov (reg rax) (label-imm (label func-b)))
    (mov (reg rax) (reg-deref (reg rax) -8))
    (mov (reg rax) (reg-deref (reg rax)))
    (ret)))

(define-metadata func-a
  (arity 5))

(define-code func-a
  (block entry
    (mov (reg rax) (imm 99))
    (ret)))
