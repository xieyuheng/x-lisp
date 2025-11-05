;; figure-3.2

(let ((x (random-dice)))
  (let ((y (random-dice)))
    (iadd (iadd x y) 42)))
