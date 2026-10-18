; Semantic: write to data field via (address ...) base + offset-of disp, then read back
;
; Encodings exercised:
;   mov reg, (address ...)                       — RIP-relative LEA-style load of label addr
;   mov [reg + offset-of(...)], imm              — C7 /0 with disp   (write to field)
;   mov reg, (mem reg (offset-of ...))     — 8B /r with disp   (read from field)

(define-struct counter-t
  (value int64-t))

(define-data my-counter
  (struct counter-t
    (value 0)))

(define-code main
  (mov (reg rax) (address my-counter))
  (mov (mem qword (reg rax) (offset-of counter-t value)) 42)
  (mov (reg rax) (mem (reg rax) (offset-of counter-t value)))
  (ret))
