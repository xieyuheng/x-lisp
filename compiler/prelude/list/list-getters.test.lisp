(import-all "list-getters")

(assert-equal (list-first [1 2 3]) 1)
(assert-equal (list-second [1 2 3]) 2)
(assert-equal (list-third [1 2 3]) 3)
