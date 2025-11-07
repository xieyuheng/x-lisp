(export inter)

(define inter
  (lambda ps
    (lambda (x)
      (cond ((list-empty? ps) #t)
            ((not (valid? (car ps) x)) #f)
            (else ((apply inter (cdr ps)) x))))))
