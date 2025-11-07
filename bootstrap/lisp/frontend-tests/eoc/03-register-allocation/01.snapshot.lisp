;; figure-3.1

(begin
  (= v 1)
  (= w 42)
  (= x (iadd v 7))
  (= y x)
  (= z (iadd x w))
  (iadd z (ineg y)))
