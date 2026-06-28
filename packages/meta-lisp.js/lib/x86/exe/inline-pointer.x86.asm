;; test: DataOperand fallback for (@pointer (@struct ...)) in operand position
;; path: (@pointer (@struct point-t ...)) → parseOperand fallback → parseExp → PointerExp
;;       → ResolveDataOperands: evaluate → PointerValue
;;       → register anonymous DataDefinition (%data-N)
;;       → replace with DerefOperand
;;       → encode: mov rax, [rip + disp32]
;;       → rax now holds pointer to anonymous struct; deref reads first field (x=77)

(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-code test-inline-pointer
  (block entry
    (mov (reg rax) (pointer (struct point-t (x 77) (y 88))))
    (mov (reg rax) (reg-deref (reg rax)))
    (ret)))
