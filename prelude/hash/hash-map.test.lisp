(import-all "../function")
(import-all "hash-map")

(assert-equal
  (@hash 2 3 4 5)
  (pipe (@hash 1 2 3 4)
    (hash-map (lambda (k v) [(iadd 1 k) (iadd 1 v)]))))

(assert-equal
  (@hash 2 2 4 4)
  (pipe (@hash 1 2 3 4)
    (hash-map-key (iadd 1))))

(assert-equal
  (@hash 1 3 3 5)
  (pipe (@hash 1 2 3 4)
    (hash-map-value (iadd 1))))
