(assert (hash? (@hash)))
(assert (hash? (@hash 1 2 3 4)))

(assert-not (hash? 1))
(assert-not (hash? []))
(assert-not (hash? {}))

(assert (hash-empty? (@hash)))
(assert-not (hash-empty? (@hash 1 2)))
(assert-not (hash-empty? (@hash 1 2 3 4)))

(assert-equal 0 (hash-length (@hash)))
(assert-equal 1 (hash-length (@hash 1 2)))
(assert-equal 2 (hash-length (@hash 1 2 3 4)))
