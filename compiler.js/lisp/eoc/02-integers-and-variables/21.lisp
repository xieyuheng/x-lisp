(let ((y 6))
  (let ((x (let ((y (ineg 42)))
             y)))
    (iadd x y)))
