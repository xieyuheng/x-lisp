; Arithmetic encodings: ADD / SUB / CMP
;
; ADD:
;  01 /r — ADD r/m64, r64  (mem += reg)
;  03 /r — ADD r64, r/m64  (reg += reg/mem)
;  83 /0 — ADD r/m64, imm8
;  81 /0 — ADD r/m64, imm32
;
; SUB:
;  29 /r — SUB r/m64, r64
;  2B /r — SUB r64, r/m64
;  83 /5 — SUB r/m64, imm8
;  81 /5 — SUB r/m64, imm32
;
; CMP:
;  39 /r — CMP r/m64, r64
;  3B /r — CMP r64, r/m64
;  83 /7 — CMP r/m64, imm8
;  81 /7 — CMP r/m64, imm32

(define-code main
  (block entry
    (add (reg rax) (reg rcx))                  ;; 03 /r: reg += reg
    (add (reg rax) (deref (reg rbp) -8))   ;; 03 /r: reg += mem
    (add (deref (reg rbp) -8) (reg rax))   ;; 01 /r: mem += reg
    (add (reg rax) 5)                    ;; 83 /0: reg += imm8
    (add (reg rax) 1000)                 ;; 81 /0: reg += imm32
    (add (deref (reg rbp) -8) 5)     ;; 83 /0: mem += imm8
    (add (deref (reg rbp) -8) 1000)  ;; 81 /0: mem += imm32
    (ret)))

(define-code sub-forms
  (block entry
    (sub (reg rax) (reg rcx))                  ;; 2B /r: reg -= reg
    (sub (reg rax) (deref (reg rbp) -8))   ;; 2B /r: reg -= mem
    (sub (deref (reg rbp) -8) (reg rax))   ;; 29 /r: mem -= reg
    (sub (reg rax) 5)                    ;; 83 /5: reg -= imm8
    (sub (reg rax) 1000)                 ;; 81 /5: reg -= imm32
    (sub (deref (reg rbp) -8) 5)     ;; 83 /5: mem -= imm8
    (sub (deref (reg rbp) -8) 1000)  ;; 81 /5: mem -= imm32
    (ret)))

(define-code cmp-forms
  (block entry
    (cmp (reg rax) (reg rcx))                  ;; 3B /r: cmp reg, reg
    (cmp (reg rax) (deref (reg rbp) -8))   ;; 3B /r: cmp reg, mem
    (cmp (deref (reg rbp) -8) (reg rax))   ;; 39 /r: cmp mem, reg
    (cmp (reg rax) 5)                    ;; 83 /7: cmp reg, imm8
    (cmp (reg rax) 1000)                 ;; 81 /7: cmp reg, imm32
    (cmp (deref (reg rbp) -8) 5)     ;; 83 /7: cmp mem, imm8
    (cmp (deref (reg rbp) -8) 1000)  ;; 81 /7: cmp mem, imm32
    (ret)))
