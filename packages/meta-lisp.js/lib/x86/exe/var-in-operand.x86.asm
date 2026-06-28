;; test: DataOperand fallback for bare symbol → named data address
;; path: answer → parseOperand fallback → parseExp → VarExp("answer")
;;       → ResolveDataOperands: evaluate → modLookupDefinition → AddressValue("answer")
;;       → replace with AddressOperand("answer")
;;       → encode: lea rax, [rip + disp32] (movabs with relocation)
;;       → then deref to read the value

(define-struct int-cell-t
  (value int64-t))

(define-data answer
  (struct int-cell-t (value 99)))

(define-code test-var-operand
  (block entry
    (mov (reg rax) answer)
    (mov (reg rax) (reg-deref (reg rax)))
    (ret)))
