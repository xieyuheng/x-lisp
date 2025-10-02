(import-all "hash-each-value")

(begin
  (= hash (@hash 1 2 3 4))
  (= list [])
  (hash-each-value
   (lambda (value)
     (list-push! value list))
   hash)
  (assert-equal [2 4] list))
