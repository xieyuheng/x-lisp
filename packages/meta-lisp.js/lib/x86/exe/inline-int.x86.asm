;; test: DataOperand fallback for integer literal in operand position
;; path: 42 → parseOperand fallback → parseExp → IntExp
;;       → ResolveDataOperands: evaluate → IntValue
;;       → replace with ImmOperand
;;       → encode: mov rax, 42

(define-code test-inline-int
  (block entry
    (mov (reg rax) 42)
    (ret)))
