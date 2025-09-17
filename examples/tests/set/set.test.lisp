(assert-equal {1 2 3} {1 2 3 1 2 3})
(assert-equal {1 2 {1 2 3}} {1 2 {1 2 3 1 2 3}})
(assert-not-equal {1 2 {1 2 3}} {1 2 {1 2}})

(assert (set? int? {1 2 3}))
(assert-not (set? int? {1 2 {1 2 3}}))

(assert (set-empty? {}))
(assert-not (set-empty? {1}))

(assert-equal 3 (set-size {1 2 3}))
