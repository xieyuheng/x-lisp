;; test: (address name) in operand position → AddressOperand
;; path: (address answer) → parseOperand → AddressOperand("answer")
;;       → encode: lea rax, [rip + disp32] (movabs with relocation)
;;       → then deref to read the value

(define-struct int-cell-t
  (value int64-t))

(define-data answer
  (struct int-cell-t (value 99)))

(define-code test-var-operand
  (block entry
    (mov (reg rax) (address answer))
    (mov (reg rax) (deref (reg rax)))
    (ret)))
