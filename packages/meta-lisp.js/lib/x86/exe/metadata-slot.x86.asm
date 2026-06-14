; x86.exe: metadata -8 slot — define-code reads its own metadata via the -8 slot pointer

(define-struct func-meta-t
  (arity int64-t))

(claim-code-metadata func-meta-t)

(define-metadata my-func
  (arity 7))

(define-code my-func
  (block entry
    (mov (reg rax) (label-imm (label my-func)))
    (mov (reg rax) (reg-deref (reg rax) -8))
    (mov (reg rax) (reg-deref (reg rax)))
    (ret)))
