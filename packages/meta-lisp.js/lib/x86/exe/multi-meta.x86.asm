; x86.exe: multiple define-code each with own define-metadata
;
; func-b (entry) has metadata arity=3, reads its own via -8 slot → 3
; func-a has metadata arity=5 (but not entry)

(define-struct func-meta-t
  (arity int64-t))

(claim-code-metadata pointer-t)

(define-metadata func-b
  (pointer
    (struct func-meta-t
      (arity 3))))

(define-code func-b
  (block entry
    (mov (reg rax) (address func-b))
    (mov (reg rax) (reg-deref (reg rax) -8))
    (mov (reg rax) (reg-deref (reg rax)))
    (ret)))

(define-metadata func-a
  (pointer
    (struct func-meta-t
      (arity 5))))

(define-code func-a
  (block entry
    (mov (reg rax) (imm 99))
    (ret)))
