; LEA encodings
;
; 8D /r — LEA r64, m
;
; Forms:
;   [base]               — mod=00 rm=base
;   [base + disp8]       — mod=01
;   [base + disp32]      — mod=10
;   [base + idx*scale]   — SIB
;   [base + idx*scale + disp] — SIB + displacement

(define-code main
  (lea (reg rax) (deref (reg rcx)))       ;; 8D /r: REX.W + 8D 01  (no disp)
  (ret))

(define-code lea-base-disp8
  (lea (reg rax) (deref (reg rbp) -8))    ;; 8D /r: REX.W + 8D 45 F8  (disp8)
  (lea (reg rax) (deref (reg rbp) 16))    ;; 8D /r: REX.W + 8D 45 10  (disp8)
  (ret))

(define-code lea-base-disp32
  (lea (reg rax) (deref (reg rbp) -200))  ;; 8D /r: mod=10 + disp32
  (lea (reg rax) (deref (reg rbp) 200))   ;; 8D /r: mod=10 + disp32
  (ret))

(define-code lea-sib
  (lea (reg rax) (deref (reg rbp) (* (reg rcx) 8)))         ;; SIB(3,rcx,rbp)
  (lea (reg rax) (deref (reg rbp) (* (reg rcx) 8) -16))     ;; SIB(3,rcx,rbp) + disp8
  (ret))
