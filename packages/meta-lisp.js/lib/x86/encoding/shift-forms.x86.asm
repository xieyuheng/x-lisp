; Shift encodings: SHL / SHR
;
; SHL:
;  D1 /4 — SHL r/m64, 1   (shift-by-1 short encoding)
;  D3 /4 — SHL r/m64, CL  (variable shift count in CL)
;  C1 /4 — SHL r/m64, imm8 (fixed shift count >1)
;
; SHR:
;  D1 /5 — SHR r/m64, 1
;  D3 /5 — SHR r/m64, CL
;  C1 /5 — SHR r/m64, imm8

(define-code main
  (shl (reg rax) 1)                    ;; D1 /4: shl by 1
  (shl (reg rax) 3)                    ;; C1 /4: shl by imm8 > 1
  (shl (reg rax) (reg rcx))                  ;; D3 /4: shl by CL
  (ret))

(define-code shr-forms
  (shr (reg rax) 1)                    ;; D1 /5: shr by 1
  (shr (reg rax) 3)                    ;; C1 /5: shr by imm8 > 1
  (shr (reg rax) (reg rcx))                  ;; D3 /5: shr by CL
  (ret))

(define-code shl-mem-forms
  (shl (mem qword (reg rbp) -8) 1)             ;; D1 /4: shl [rbp-8] by 1
  (shl (mem qword (reg rbp) -8) 3)             ;; C1 /4: shl [rbp-8] by imm8
  (shl (mem qword (reg rbp) -8) (reg rcx))     ;; D3 /4: shl [rbp-8] by CL
  (ret))

(define-code shr-mem-forms
  (shr (mem qword (reg rbp) -8) 1)             ;; D1 /5: shr [rbp-8] by 1
  (shr (mem qword (reg rbp) -8) 3)             ;; C1 /5: shr [rbp-8] by imm8
  (shr (mem qword (reg rbp) -8) (reg rcx))     ;; D3 /5: shr [rbp-8] by CL
  (ret))
