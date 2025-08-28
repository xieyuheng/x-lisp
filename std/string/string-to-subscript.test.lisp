(import-all "string-to-subscript.lisp")

(assert-equal
  (string-to-subscript "x01")
  "x₀₁")
