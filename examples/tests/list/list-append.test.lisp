(assert-equal
  (list-append [1 2 3] [4 5 6])
  [1 2 3 4 5 6])

(assert-equal
  (list-append [1 2 3 :x 1 :y 2 :z 3] [4 5 6])
  [1 2 3 4 5 6 :x 1 :y 2 :z 3])

;; the record part of the second list is ignored:

(assert-equal
  (list-append [1 2 3 :x 1 :y 2 :z 3] [4 5 6 :x 0])
  [1 2 3 4 5 6 :x 1 :y 2 :z 3])
