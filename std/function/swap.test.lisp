(import-all "swap.lisp")

(assert-equal
  (swap cons [] 1)
  (cons 1 []))
