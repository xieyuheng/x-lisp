; SYSCALL encoding
;
; 0F 05 — SYSCALL
;
; Not executed in semantics tests (exit syscall would terminate the runner).

(define-code main
  (syscall)
  (ret))
