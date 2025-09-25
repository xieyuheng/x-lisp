(import-all "hash-from-entries.lisp")

(assert-equal
  (@hash 'a 1 'b 2)
  (hash-from-entries [['a 1] ['b 2]]))
