(import-all "list-take")

(assert-equal (list-take 0 [1 2 3]) [])
(assert-equal (list-take 1 [1 2 3]) [1])
(assert-equal (list-take 2 [1 2 3]) [1 2])
(assert-equal (list-take 3 [1 2 3]) [1 2 3])
(assert-equal (list-take 4 [1 2 3]) [1 2 3])
