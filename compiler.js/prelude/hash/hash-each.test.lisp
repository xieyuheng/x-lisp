(import-all "hash-each")

(begin
  (= hash (@hash 1 2 3 4))
  (= list [])
  (hash-each-value
   (lambda (value)
     (list-push! value list))
   hash)
  (assert-equal [2 4] list))

(begin
  (= hash (@hash 1 2 3 4))
  (= list [])
  (hash-each-key
   (lambda (key)
     (list-push! key list))
   hash)
  (assert-equal [1 3] list))

(begin
  (= hash (@hash 1 2 3 4))
  (= list [])
  (hash-each
   (lambda (key value)
     (list-push! key list)
     (list-push! value list))
   hash)
  (assert-equal [1 2 3 4] list))
