(include-all "list-member")

(assert (list-member? 2 [1 2 3]))
(assert-not (list-member? 0 [1 2 3]))
