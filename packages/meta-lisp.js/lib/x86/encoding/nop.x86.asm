; NOP encoding
;
; 90 — NOP

(define-code test-nop
  (block entry
    (nop)
    (ret)))
