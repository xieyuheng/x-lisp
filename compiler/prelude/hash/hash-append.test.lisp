(import-all "hash-append")

(assert-equal (@hash 1 2 3 4) (hash-append (@hash 1 2) (@hash 3 4)))
(assert-equal (@hash 1 2 3 4) (hash-append (@hash 1 2 3 5) (@hash 3 4)))
