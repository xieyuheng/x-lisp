(define (list-zip left right)
  (cond ((or (list-empty? left)
             (list-empty? right))
         [])
        (else
         (cons [(car left) (car right)]
               (list-zip (cdr left) (cdr right))))))
