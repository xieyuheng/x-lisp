(import-all "hash-each-key")

(begin
  (= hash (@hash 1 2 3 4))
  (= list [])
  (hash-each-key
   (lambda (key)
     (list-push! key list))
   hash)
  (assert-equal [1 3] list))
