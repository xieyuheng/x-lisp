(import-all "index")

(assert-equal
  (swap cons [] 1)
  (cons 1 []))
