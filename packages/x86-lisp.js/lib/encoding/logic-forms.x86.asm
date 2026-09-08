; Bitwise logic encodings: AND / OR / XOR
;
; AND:
;  23 /r — AND r64, r/m64  (reg &= reg)
;  21 /r — AND r/m64, r64  (mem &= reg)
;  83 /4 — AND r/m64, imm8
;  81 /4 — AND r/m64, imm32
;  80 /4 — AND r/m8, imm8
;
; OR:
;  0B /r — OR r64, r/m64
;  09 /r — OR r/m64, r64
;  83 /1 — OR r/m64, imm8
;  81 /1 — OR r/m64, imm32
;  80 /1 — OR r/m8, imm8
;
; XOR:
;  33 /r — XOR r64, r/m64
;  31 /r — XOR r/m64, r64
;  83 /6 — XOR r/m64, imm8
;  81 /6 — XOR r/m64, imm32
;  80 /6 — XOR r/m8, imm8

(define-code main
  (and (reg rax) (reg rcx))                  ;; 23 /r: reg &= reg
  (and (reg rax) 7)                    ;; 83 /4: reg &= imm8
  (and (reg rax) 255)                  ;; 81 /4: reg &= imm32
  (ret))

(define-code or-forms
  (or (reg rax) (reg rcx))                   ;; 0B /r: reg |= reg
  (or (reg rax) 7)                     ;; 83 /1: reg |= imm8
  (or (reg rax) 255)                   ;; 81 /1: reg |= imm32
  (ret))

(define-code xor-forms
  (xor (reg rax) (reg rcx))                  ;; 33 /r: reg ^= reg
  (xor (reg rax) 7)                    ;; 83 /6: reg ^= imm8
  (xor (reg rax) 255)                  ;; 81 /6: reg ^= imm32
  (ret))

(define-code and-mem-forms
  (and (mem qword (reg rbp) -8) (reg rax))            ;; 21 /r: mem &= reg
  (and (mem qword (reg rbp) -8) 7)              ;; 83 /4: mem &= imm8
  (and (mem qword (reg rbp) -8) 1000)           ;; 81 /4: mem &= imm32
  (and (mem byte (reg rbp) -8) (reg al))        ;; 20 /r: byte mem &= reg
  (and (mem byte (reg rbp) -8) 7)               ;; 80 /4: byte mem &= imm8
  (and (reg rax) (mem qword (reg rbp) -8))      ;; 23 /r: reg &= mem
  (ret))

(define-code or-mem-forms
  (or (mem qword (reg rbp) -8) (reg rax))               ;; 09 /r: mem |= reg
  (or (mem qword (reg rbp) -8) 7)                 ;; 83 /1: mem |= imm8
  (or (mem qword (reg rbp) -8) 1000)              ;; 81 /1: mem |= imm32
  (or (reg rax) (mem qword (reg rbp) -8))         ;; 0B /r: reg |= mem
  (ret))

(define-code xor-mem-forms
  (xor (mem qword (reg rbp) -8) (reg rax))                ;; 31 /r: mem ^= reg
  (xor (mem qword (reg rbp) -8) 7)                  ;; 83 /6: mem ^= imm8
  (xor (mem qword (reg rbp) -8) 1000)               ;; 81 /6: mem ^= imm32
  (xor (reg rax) (mem qword (reg rbp) -8))          ;; 33 /r: reg ^= mem
  (ret))
