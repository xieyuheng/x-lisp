; SAR encodings
;
; SAR:
;  D1 /7 — SAR r/m64, 1
;  D3 /7 — SAR r/m64, CL
;  C1 /7 — SAR r/m64, imm8

(define-code main
  (sar (reg rax) 1)                    ;; D1 /7: sar by 1
  (sar (reg rax) 3)                    ;; C1 /7: sar by imm8 > 1
  (sar (reg rax) (reg rcx))                  ;; D3 /7: sar by CL
  (ret))

(define-code sar-mem-forms
  (sar (mem qword (reg rbp) -8) 1)             ;; D1 /7: sar [rbp-8] by 1
  (sar (mem qword (reg rbp) -8) 3)             ;; C1 /7: sar [rbp-8] by imm8
  (sar (mem qword (reg rbp) -8) (reg rcx))     ;; D3 /7: sar [rbp-8] by CL
  (ret))
