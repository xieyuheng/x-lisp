(export union)

(define union
  (lambda ps
    (lambda (x)
      (cond ((list-empty? ps) #f)
            ((valid? (car ps) x) #t)
            (else ((apply union (cdr ps)) x))))))
