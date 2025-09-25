(assert (hash? (@hash)))
(assert (hash? (@hash 1 2 3 4)))

(assert-not (hash? 1))
(assert-not (hash? []))
(assert-not (hash? {}))
