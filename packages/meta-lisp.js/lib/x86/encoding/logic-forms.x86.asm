; Bitwise logic encodings: AND / OR / XOR
;
; AND:
;  23 /r — AND r64, r/m64  (reg &= reg)
;  83 /4 — AND r/m64, imm8
;  81 /4 — AND r/m64, imm32
;
; OR:
;  0B /r — OR r64, r/m64
;  83 /1 — OR r/m64, imm8
;  81 /1 — OR r/m64, imm32
;
; XOR:
;  33 /r — XOR r64, r/m64
;  83 /6 — XOR r/m64, imm8
;  81 /6 — XOR r/m64, imm32

(define-code and-forms
  (block entry
    (and (reg rax) (reg rcx))                  ;; 23 /r: reg &= reg
    (and (reg rax) (imm 7))                    ;; 83 /4: reg &= imm8
    (and (reg rax) (imm 255))                  ;; 81 /4: reg &= imm32
    (ret)))

(define-code or-forms
  (block entry
    (or (reg rax) (reg rcx))                   ;; 0B /r: reg |= reg
    (or (reg rax) (imm 7))                     ;; 83 /1: reg |= imm8
    (or (reg rax) (imm 255))                   ;; 81 /1: reg |= imm32
    (ret)))

(define-code xor-forms
  (block entry
    (xor (reg rax) (reg rcx))                  ;; 33 /r: reg ^= reg
    (xor (reg rax) (imm 7))                    ;; 83 /6: reg ^= imm8
    (xor (reg rax) (imm 255))                  ;; 81 /6: reg ^= imm32
    (ret)))
