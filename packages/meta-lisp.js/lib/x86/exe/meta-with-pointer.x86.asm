; x86.exe: metadata struct with pointer-t field
;
; Metadata struct has: arity (int64) + name (string-t)
; meta.name -> "triple"
; define-code reads metadata name first byte via -8 slot -> 't' = 116

(define-struct func-meta-t
  (arity int64-t)
  (name string-t))

(define-metadata my-func
  (pointer
    (struct func-meta-t
      (arity 3)
      (name "triple"))))

(define-code my-func
  (block entry
    (mov (reg rax) (address my-func))
    (mov (reg rax) (reg-deref (reg rax) -8))
    (mov (reg rax) (reg-deref (reg rax) 8))
    (mov (reg rax) (reg-deref (reg rax)))
    (and (reg rax) (imm 255))
    (ret)))
