; Indirect call encoding
;
; FF /2 — CALL r/m64  (ModRM mod=3 reg=2 rm=register)
;
; Direct call (E8 rel32) already covered in semantic tests.

(define-code main
  (block entry
    (call (deref (reg rax)))              ;; FF /2: FF D0  (call rax)
    (ret)))

(define-code call-indirect-ext
  (block entry
    (call (deref (reg r8)))               ;; FF /2: 41 FF D0  (call r8, REX.B)
    (ret)))
