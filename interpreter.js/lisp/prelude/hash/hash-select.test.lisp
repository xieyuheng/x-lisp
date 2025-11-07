(import-all "../function")
(import-all "hash-select")

(assert-equal
  (@hash 'a 1 'b 2)
  (hash-select (drop int-non-negative?) (@hash 'a 1 'b 2 'x -1 'y -2)))

(assert-equal
  (@hash 'a 1 'b 2)
  (hash-select-value int-non-negative? (@hash 'a 1 'b 2 'x -1 'y -2)))

(assert-equal
  (@hash 1 'a 2 'b)
  (hash-select-key int-non-negative? (@hash 1 'a 2 'b -1 'x -2 'y)))

(assert-equal
  (@hash 'x -1 'y -2)
  (hash-reject (drop int-non-negative?) (@hash 'a 1 'b 2 'x -1 'y -2)))

(assert-equal
  (@hash 'x -1 'y -2)
  (hash-reject-value int-non-negative? (@hash 'a 1 'b 2 'x -1 'y -2)))

(assert-equal
  (@hash -1 'x -2 'y)
  (hash-reject-key int-non-negative? (@hash 1 'a 2 'b -1 'x -2 'y)))
