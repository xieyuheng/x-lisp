(let ((x 1))
  (iadd x (let ((x (let ((x 5))
                     (iadd x x))))
            (iadd x 100))))
