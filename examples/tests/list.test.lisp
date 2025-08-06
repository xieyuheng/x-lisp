['a]
['a 'b 'c]
[1 2 3]
['a 'b 'c 1 2 3 "a b c"]

[[1 2 3]
 [4 5 6]
 [7 8 9]]

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
