; Operand-size forms — byte / word / dword / qword
;
; The size of a mem operand is given as its first argument:
;   (mem byte (address ...))   1 byte
;   (mem word (reg ...))       2 bytes (0x66 prefix)
;   (mem dword (reg ...))      4 bytes
;   (mem qword (reg ...))      8 bytes (REX.W)
; When omitted, the size is inferred from the paired register.
; Integers may be written in hex (0x...) / bin (0b...) / oct (0o...).

(define-space buffer 8)

(define-code main
  (mov (reg al) (mem byte (address buffer)))      ;; 8A 05 disp32
  (mov (mem byte (address buffer)) (reg al))      ;; 88 05 disp32
  (mov (mem byte (address buffer)) 0x61)          ;; C6 05 disp32 61
  (mov (reg eax) (mem dword (reg rbp) -8))        ;; 8B 45 F8
  (mov (mem dword (reg rbp) -8) 0b11110000)       ;; C7 45 F8 F0 00 00 00
  (mov (reg rax) (mem qword (reg rbp) -8))        ;; 48 8B 45 F8
  (ret))

(define-code cmp-sub-sizes
  (cmp (mem byte (address buffer)) 0x61)          ;; 80 3D disp32 61
  (sub (mem byte (address buffer)) 0x20)          ;; 80 2D disp32 20
  (cmp (reg al) 0x61)                               ;; 3C 61
  (cmp (reg ax) 0x7a)                               ;; 66 3D 7A 00
  (cmp (reg eax) 97)                                ;; 3D 61 00 00 00
  (cmp (reg rax) 97)                                ;; 48 3D 61 00 00 00
  (ret))

(define-code inferred-size
  (mov (reg al) (mem (address buffer)))           ;; 8A 05 disp32, inferred byte
  (mov (reg rax) (mem (address buffer)))          ;; 48 8B 05 disp32, inferred qword
  (ret))
