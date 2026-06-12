; ModRM / SIB boundary cases
;
; Intel reference: mod=00 rm=101 → [rip+disp32] (not [rbp])
;                  mod=00 rm=100 → SIB follows
;
; [rbp] / [r13]  — forced disp8(0) because mod=00 rm=101 = [rip+disp32]
; [rsp] / [r12]  — forced SIB byte because rm=100
; [base + disp8]  — mod=01
; [base + disp32] — mod=10
; [base + index*scale] — SIB with index
; [base + index*scale + disp] — full SIB + displacement

(define-code rbp-displacement
  (block entry
    (mov (reg rax) (reg-deref (reg rbp) 0))              ;; [rbp+0] → mod=01 disp8(0)
    (mov (reg rax) (reg-deref (reg rbp) -8))             ;; [rbp-8] → mod=01 disp8
    (mov (reg rax) (reg-deref (reg rbp) -128))           ;; [rbp-128] → mod=10 disp32 (imm8 boundary)
    (ret)))

(define-code rsp-sib
  (block entry
    (mov (reg rax) (reg-deref (reg rsp) 0))              ;; [rsp] → mod=00 rm=100 SIB(0,4,4)
    (mov (reg rax) (reg-deref (reg rsp) 8))              ;; [rsp+8] → mod=01 rm=100 SIB(0,4,4)
    (ret)))

(define-code sib-with-index
  (block entry
    (mov (reg rax) (reg-deref (reg rbp) (reg rcx) 8))    ;; [rbp+rcx*8] → SIB(3,rcx,rbp)
    (mov (reg rax) (reg-deref (reg rbp) (reg rcx) 8 -16));; [rbp+rcx*8-16] → SIB(3,rcx,rbp) + disp8
    (ret)))
