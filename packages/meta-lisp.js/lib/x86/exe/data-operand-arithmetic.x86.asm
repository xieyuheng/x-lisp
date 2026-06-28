;; test: DataOperand fallback for integers in arithmetic instructions
;; path: 10 → DataOperand → IntExp → ImmOperand → mov
;;       5  → DataOperand → IntExp → ImmOperand → add
;;       3  → DataOperand → IntExp → ImmOperand → sub
;; verifies that DataOperand resolution is not mov-specific

(define-code test-data-operand-arithmetic
  (block entry
    (mov (reg rax) 10)
    (add (reg rax) 5)
    (sub (reg rax) 3)
    (ret)))
