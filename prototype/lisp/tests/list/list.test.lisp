(assert (list? int? [1 2 3]))
(assert-not (list? symbol? [1 2 3]))

(assert-equal
  [[1 2 3]
   [4 5 6]
   [7 8 9]]
  [[1 2 3]
   [4 5 6]
   [7 8 9]])

(assert-not-equal
  [[1 2 3]
   [4 5 6]
   [7 8 9]]
  [[1 2 3]
   [4 5 6]
   [7 8 10]])

(assert (list-empty? []))
(assert-not (list-empty? [1]))

(assert-equal (cons 1 (cons 2 (cons 3 []))) [1 2 3])
(assert-equal (car [1 2 3]) 1)
(assert-equal (cdr [1 2 3]) [2 3])

(assert-equal (list-head [1 2 3]) 1)
(assert-equal (list-tail [1 2 3]) [2 3])

(assert-equal (list-init [1 2 3]) [1 2])
(assert-equal (list-last [1 2 3]) 3)

(assert-equal {1 2 3} (list-to-set [1 2 3]))
