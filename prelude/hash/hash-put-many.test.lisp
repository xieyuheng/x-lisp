(import-all "hash-put-many")

(assert-equal (@hash 'a 1 'b 2) (hash-put-many [['a 1] ['b 2]] (@hash)))

(begin
  (= hash (@hash))
  (assert-equal (@hash 'a 1 'b 2) (hash-put-many! [['a 1] ['b 2]] hash))
  (assert-equal (@hash 'a 1 'b 2) hash))
