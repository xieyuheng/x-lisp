; MOV encodings — operand-form dispatch coverage
;
;  8B /r — mov r64, r/m64  (reg ← reg or mem)
;  89 /r — mov r/m64, r64  (mem ← reg)
;  C7 /0 — mov r/m64, imm32
;  8D /r — LEA (address in flat mode uses LEA with rip-relative)

(define-code main
  (block entry
    (mov (reg rax) (reg rcx))                  ;; 8B /r: REX.W + 8B C1
    (mov (reg rcx) (reg rax))                  ;; 8B /r: REX.W + 8B C8
    (mov (reg r8) (reg r9))                    ;; 8B /r: REX.W+R.X+R.B + 8B C1
    (ret)))

(define-code mov-reg-imm
  (block entry
    (mov (reg rax) 42)                   ;; C7 /0: REX.W + C7 C0 + imm32
    (mov (reg rcx) -1)                   ;; C7 /0: REX.W + C7 C1 + imm32
    (mov (reg r8) 7)                     ;; C7 /0: REX.B + C7 C0 + imm32
    (ret)))

(define-code mov-mem-reg
  (block entry
    (mov (deref (reg rbp) -8) (reg rax))   ;; 89 /r: REX.W + 89 45 F8
    (mov (deref (reg rbp) -8) (reg rcx))   ;; 89 /r: REX.W + 89 4D F8
    (ret)))

(define-code mov-reg-mem
  (block entry
    (mov (reg rax) (deref (reg rbp) -8))   ;; 8B /r: REX.W + 8B 45 F8
    (mov (reg rcx) (deref (reg rbp) -8))   ;; 8B /r: REX.W + 8B 4D F8
    (ret)))

(define-code mov-mem-imm
  (block entry
    (mov (deref (reg rbp) -8) 42)    ;; C7 /0: REX.W + C7 45 F8 + imm32
    (ret)))
