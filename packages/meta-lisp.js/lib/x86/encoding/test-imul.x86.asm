; TEST and IMUL encodings
;
; TEST:
;  85 /r — TEST r/m64, r64
;
; IMUL:
;  0F AF /r — IMUL r64, r/m64  (two-operand form)

(define-code main
  (test (reg rax) (reg rax))                ;; 85 /r: REX.W + 85 C0
  (test (reg rcx) (reg rdx))                ;; 85 /r: REX.W + 85 D1
  (ret))

(define-code imul-form
  (imul (reg rax) (reg rcx))                ;; 0F AF /r: REX.W + 0F AF C1
  (imul (reg rax) (deref (reg rbp) -8)) ;; 0F AF /r: REX.W + 0F AF 45 F8
  (ret))
