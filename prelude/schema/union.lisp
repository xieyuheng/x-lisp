(export union)

(claim union
  (*-> (-> anything? bool?)
       (-> anything? bool?)))

(define union
  (lambda ps
    (lambda (x)
      (cond ((list-empty? ps) #f)
            (((car ps) x) #t)
            (else ((apply union (cdr ps)) x))))))
