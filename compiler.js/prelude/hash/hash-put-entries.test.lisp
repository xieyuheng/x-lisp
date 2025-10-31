(import-all "hash-put-entries")

(assert-equal (@hash 'a 1 'b 2) (hash-put-entries [['a 1] ['b 2]] (@hash)))

(begin
  (= hash (@hash))
  (assert-equal (@hash 'a 1 'b 2) (hash-put-entries! [['a 1] ['b 2]] hash))
  (assert-equal (@hash 'a 1 'b 2) hash))
