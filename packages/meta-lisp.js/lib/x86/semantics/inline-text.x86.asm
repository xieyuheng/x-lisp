;; test: DataOperand fallback for text literal in operand position
;; path: "hello" → parseOperand fallback → parseExp → StringExp
;;       → ResolveDataOperands: evaluate → StringValue
;;       → register anonymous DataDefinition (©data.N with PointerExp)
;;       → replace with DerefOperand
;;       → encode: mov rax, [rip + disp32]

(define-code main
  (mov (reg rax) "hello")
  (mov (reg rax) (deref (reg rax)))
  (and (reg rax) 255)
  (ret))
