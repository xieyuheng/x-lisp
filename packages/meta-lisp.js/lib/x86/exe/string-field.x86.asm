; x86.exe: string-t field — pointer to string, read first byte
;
; data layout (depth-first):
;   config.desc → 8B placeholder (reloc → string bytes)
;   "abc\0"
;
; define-code: load config.desc pointer, deref to 8 bytes, mask to first char → 97 ('a')

(define-struct config-t
  (version int64-t)
  (description string-t))

(claim my-config config-t)
(define-data my-config
  (struct
    (version 1)
    (description "abc")))

(define-code read-first-char
  (block entry
    (lea (reg rax) (address my-config description))
    (mov (reg rax) (reg-deref (reg rax)))
    (mov (reg rax) (reg-deref (reg rax)))
    (and (reg rax) (imm 255))
    (ret)))
