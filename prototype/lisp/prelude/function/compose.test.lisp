(import-all "compose")

(assert-equal ((compose) 0) 0)
(assert-equal ((compose (iadd 1)) 0) 1)
(assert-equal ((compose (iadd 1) (iadd 1)) 0) 2)
(assert-equal ((compose (iadd 1) (iadd 1) (iadd 1)) 0) 3)

;; about the order of compose

(assert-equal
  ((compose (iadd 1) (imul 2)) 1)
  (iadd 1 (imul 2 1)))
