(define (list-zip left right)
  (if (or (list-empty? left)
          (list-empty? right))
    []
    (cons [(car left) (car right)]
          (list-zip (cdr left) (cdr right)))))
