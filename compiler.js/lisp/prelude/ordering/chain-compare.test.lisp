(import-all "../function")
(import-all "chain-compare")

(assert-equal
  [[1 1] [1 2] [2 1] [2 2]]
  (pipe [[2 2] [2 1] [1 2] [1 1]]
    (list-sort
     (chain-compare
      (lambda ([x1 y1] [x2 y2])
        (int-compare-ascending x1 x2))
      (lambda ([x1 y1] [x2 y2])
        (int-compare-ascending y1 y2))))))
