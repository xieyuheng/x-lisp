;; test: DataOperand fallback for string literal in operand position
;; path: "hello" → parseOperand fallback → parseExp → StringExp
;;       → ResolveDataOperands: evaluate → StringValue
;;       → register anonymous DataDefinition (©data.N with PointerExp)
;;       → replace with DerefOperand
;;       → encode: mov rax, [rip + disp32]

(define-code test-inline-string
  (block entry
    (mov (reg rax) "hello")
    (mov (reg rax) (deref (reg rax)))
    (and (reg rax) 255)
    (ret)))
