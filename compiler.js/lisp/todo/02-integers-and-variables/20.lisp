(let ((x 1))
  (iadd x (let ((x (let ((y 5))
                     (iadd y x))))
            (iadd x 100))))
