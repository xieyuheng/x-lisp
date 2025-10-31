(import-all "pipe")

(assert-equal ((pipe 0)) 0)
(assert-equal (pipe 0 (iadd 1)) 1)
(assert-equal (pipe 0 (iadd 1) (iadd 1)) 2)
(assert-equal (pipe 0 (iadd 1) (iadd 1) (iadd 1)) 3)

;; about the order of pipe

(assert-equal
  (pipe 1 (iadd 1) (imul 2))
  (imul 2 (iadd 1 1)))
