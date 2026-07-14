; x86.exe: zero-length string-t field
;
; data layout:
;   msg.text → 8B placeholder (reloc → "")
;   ""\0 after all struct fields (just a null byte)
;
; define-code: load string pointer, read first byte = 0 (null terminator)

(define-struct msg-t
  (version int64-t)
  (text string-t))

(define-data my-msg
  (struct msg-t
    (version 1)
    (text "")))

(define-code read-null-char
  (block entry
    (mov (reg rax) (address my-msg))
    (mov (reg rax) (reg-deref (reg rax) (offset-of msg-t text)))
    (mov (reg rax) (reg-deref (reg rax)))
    (and (reg rax) 255)
    (ret)))
