(import-all "hash-each")

(begin
  (= hash (@hash 1 2 3 4))
  (= list [])
  (hash-each
   (lambda (key value)
     (list-push! key list)
     (list-push! value list))
   hash)
  (assert-equal [1 2 3 4] list))
