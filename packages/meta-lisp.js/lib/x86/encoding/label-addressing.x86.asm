; Label addressing encodings — RIP-relative forms
;
; address: load label address as immediate
;   mov reg, (address ...)  → LEA rip-relative   (REX.W + 8D /r + mod=00 rm=101 + disp32)
;
; deref: dereference an address (load value at label address)
;   mov reg, (deref (address ...)) → MOV rip-relative   (REX.W + 8B /r + mod=00 rm=101 + disp32)
;   lea reg, (address ...)         → LEA rip-relative   (REX.W + 8D /r + mod=00 rm=101 + disp32)
;
; target label defined by another define-code block.

(define-code main
  (block entry
    (mov (reg rax) (address target))        ;; LEA rax, [rip+disp32]  — load &target
    (ret)))

(define-code test-mov-deref
  (block entry
    (mov (reg rax) (deref (address target)))  ;; MOV rax, [rip+disp32]  — load *target
    (ret)))

(define-code test-lea-address
  (block entry
    (lea (reg rax) (address target))        ;; LEA rax, [rip+disp32]  — load &target
    (ret)))

(define-code target
  (block entry
    (mov (reg rax) 99)
    (ret)))
