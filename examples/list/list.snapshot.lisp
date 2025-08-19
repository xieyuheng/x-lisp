['a]
['a 'b 'c]
[1 2 3]
['a 'b 'c 1 2 3 "a b c"]

[[1 2 3]
 [4 5 6]
 [7 8 9]]

(assert (list? int? [1 2 3]))
(assert (not (list? symbol? [1 2 3])))

(assert (equal? [[1 2 3]
                 [4 5 6]
                 [7 8 9]]
                [[1 2 3]
                 [4 5 6]
                 [7 8 9]]))

(assert (not (equal? [[1 2 3]
                      [4 5 6]
                      [7 8 9]]
                     [[1 2 3]
                      [4 5 6]
                      [7 8 10]])))

(assert (equal? (list-length [1 2 3])
                3))

(assert (equal? (list-append [1 2 3] [4 5 6])
                [1 2 3 4 5 6]))

(assert (equal? (list-append [1 2 3 :x 1 :y 2 :z 3] [4 5 6])
                [1 2 3 4 5 6 :x 1 :y 2 :z 3]))

;; the record part of the second list is ignored:
(assert (equal? (list-append [1 2 3 :x 1 :y 2 :z 3] [4 5 6 :x 0])
                [1 2 3 4 5 6 :x 1 :y 2 :z 3]))

(assert (equal? (list-of [1 2 3 :x 1 :y 2 :z 3])
                [1 2 3]))

(assert (list-empty? []))
(assert (not (list-empty? [1])))

(assert (equal? (cons 1 (cons 2 (cons 3 []))) [1 2 3]))
(assert (equal? (car [1 2 3]) 1))
(assert (equal? (cdr [1 2 3]) [2 3]))

(assert (equal? (list-head [1 2 3]) 1))
(assert (equal? (list-tail [1 2 3]) [2 3]))

(assert (equal? (list-init [1 2 3]) [1 2]))
(assert (equal? (list-last [1 2 3]) 3))

(assert (equal? (list-get [1 2 3] 0) 1))
(assert (equal? (list-get [1 2 3] 1) 2))
(assert (equal? (list-get [1 2 3] 2) 3))

(begin
  (= list [0 0 0])
  (assert (equal? (list-get list 0) 0))
  (assert (equal? (list-get list 1) 0))
  (assert (equal? (list-get list 2) 0))
  (= list (list-set list 0 1))
  (assert (equal? (list-get list 0) 1))
  (= list (list-set list 1 2))
  (assert (equal? (list-get list 1) 2))
  (= list (list-set list 2 3))
  (assert (equal? (list-get list 2) 3)))
