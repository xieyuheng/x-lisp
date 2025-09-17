(assert-equal {1 2 3} {1 2 3 1 2 3})
(assert-equal {1 2 {1 2 3}} {1 2 {1 2 3 1 2 3}})
(assert-not-equal {1 2 {1 2 3}} {1 2 {1 2}})
