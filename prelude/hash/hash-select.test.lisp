(import-all "../function")
(import-all "hash-select")

(assert-equal
  (@hash 'a 1 'b 2)
  (hash-select (drop int-non-negative?) (@hash 'a 1 'b 2 'x -1 'y -2)))

(assert-equal
  (@hash 'x -1 'y -2)
  (hash-reject (drop int-non-negative?) (@hash 'a 1 'b 2 'x -1 'y -2)))
