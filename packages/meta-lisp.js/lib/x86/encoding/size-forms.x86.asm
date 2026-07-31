; Operand-size forms — byte / word / dword / qword
;
; The size of a deref operand is given as its first argument:
;   (deref byte (address ...))   1 byte
;   (deref word (reg ...))       2 bytes (0x66 prefix)
;   (deref dword (reg ...))      4 bytes
;   (deref qword (reg ...))      8 bytes (REX.W)
; When omitted, the size is inferred from the paired register.
; Integers may be written in hex (0x...) / bin (0b...) / oct (0o...).

(define-space buffer 8)

(define-code main
  (block entry
    (mov (reg al) (deref byte (address buffer)))      ;; 8A 05 disp32
    (mov (deref byte (address buffer)) (reg al))      ;; 88 05 disp32
    (mov (deref byte (address buffer)) 0x61)          ;; C6 05 disp32 61
    (mov (reg eax) (deref dword (reg rbp) -8))        ;; 8B 45 F8
    (mov (deref dword (reg rbp) -8) 0b11110000)       ;; C7 45 F8 F0 00 00 00
    (mov (reg rax) (deref qword (reg rbp) -8))        ;; 48 8B 45 F8
    (ret)))

(define-code cmp-sub-sizes
  (block entry
    (cmp (deref byte (address buffer)) 0x61)          ;; 80 3D disp32 61
    (sub (deref byte (address buffer)) 0x20)          ;; 80 2D disp32 20
    (cmp (reg al) 0x61)                               ;; 3C 61
    (cmp (reg ax) 0x7a)                               ;; 66 3D 7A 00
    (cmp (reg eax) 97)                                ;; 3D 61 00 00 00
    (cmp (reg rax) 97)                                ;; 48 3D 61 00 00 00
    (ret)))

(define-code inferred-size
  (block entry
    (mov (reg al) (deref (address buffer)))           ;; 8A 05 disp32, inferred byte
    (mov (reg rax) (deref (address buffer)))          ;; 48 8B 05 disp32, inferred qword
    (ret)))
