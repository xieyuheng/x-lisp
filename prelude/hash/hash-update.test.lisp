(import-all "hash-update")

(assert-equal
  (@hash 1 2 3 4)
  (pipe (@hash 1 1 3 4)
    (hash-update 1 (iadd 1))))

(begin
  (= hash (@hash 1 1 3 4))
  (assert-equal (@hash 1 2 3 4) (hash-update! 1 (iadd 1) hash))
  (assert-equal (@hash 1 2 3 4) hash))
