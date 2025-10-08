(export inter)

(claim inter
  (*-> (-> anything? bool?)
       (-> anything? bool?)))

(define inter
  (lambda ps
    (lambda (x)
      (cond ((list-empty? ps) #t)
            ((not ((car ps) x)) #f)
            (else ((apply inter (cdr ps)) x))))))
