(assert-equal
  (parse-sexp "(f x)")
  '(f x))

(assert-equal
  (parse-sexps "(f x) (g y)")
  '((f x) (g y)))
