; x86.exe: zero-length text-t field
;
; data layout:
;   msg.text → 8B placeholder (reloc → "")
;   ""\0 after all struct fields (just a null byte)
;
; define-code: load text pointer, read first byte = 0 (null terminator)

(define-struct msg-t
  (version int64-t)
  (text text-t))

(define-data my-msg
  (struct msg-t
    (version 1)
    (text "")))

(define-code main
  (mov (reg rax) (address my-msg))
  (mov (reg rax) (deref (reg rax) (offset-of msg-t text)))
  (mov (reg rax) (deref (reg rax)))
  (and (reg rax) 255)
  (ret))
