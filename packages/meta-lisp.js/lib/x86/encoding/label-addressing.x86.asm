; Label addressing encodings — RIP-relative forms
;
; label-imm: load label address as immediate
;   mov reg, label-imm  → LEA rip-relative   (REX.W + 8D /r + mod=00 rm=101 + disp32)
;
; label-deref: dereference label (load value at label address)
;   mov reg, label-deref → MOV rip-relative   (REX.W + 8B /r + mod=00 rm=101 + disp32)
;   lea reg, label-deref → LEA rip-relative   (REX.W + 8D /r + mod=00 rm=101 + disp32)
;
; target label defined by another define-code block.

(define-code test-mov-label-imm
  (block entry
    (mov (reg rax) (label-imm (label target)))    ;; LEA rax, [rip+disp32]  — load &target
    (ret)))

(define-code test-mov-label-deref
  (block entry
    (mov (reg rax) (label-deref (label target)))  ;; MOV rax, [rip+disp32]  — load *target
    (ret)))

(define-code test-lea-label-deref
  (block entry
    (lea (reg rax) (label-deref (label target)))  ;; LEA rax, [rip+disp32]  — load &target
    (ret)))

(define-code target
  (block entry
    (mov (reg rax) (imm 99))
    (ret)))
