(import-all "../function")
(import-all "hash-from-map")

(assert-equal
  (@hash 1 10 2 20 3 30)
  (pipe '(1 2 3)
    (hash-from-map (imul 10))))
